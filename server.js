// Emoji Guess (phone edition) — hosted server.
// Each game page tells the server which TikTok username to follow; the server reads
// that LIVE chat and sends the comments back to the page.
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { TikTokLiveConnection, WebcastEvent } from 'tiktok-live-connector';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const RETRY_MS = 15000;
const MAX_SESSIONS = 20;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const server = createServer(app);
const io = new Server(server);

const sessions = new Map(); // username -> session

const cleanName = (raw) =>
  String(raw || '').trim().replace(/^@/, '').replace(/[^A-Za-z0-9._]/g, '').slice(0, 24).toLowerCase();

io.on('connection', (socket) => {
  let joined = null;

  socket.on('watch', (raw) => {
    leave();
    const username = cleanName(raw);
    if (!username) {
      socket.emit('status', { live: false, username: '' });
      return;
    }
    let s = sessions.get(username);
    if (!s) {
      if (sessions.size >= MAX_SESSIONS) {
        socket.emit('status', { live: false, username, error: 'Server is busy. Try again later.' });
        return;
      }
      s = createSession(username);
      sessions.set(username, s);
    }
    joined = username;
    socket.join(room(username));
    s.viewers.add(socket.id);
    socket.emit('status', { live: s.live, username, error: s.error || '' });
  });

  socket.on('disconnect', leave);

  function leave() {
    if (!joined) return;
    socket.leave(room(joined));
    const s = sessions.get(joined);
    if (s) {
      s.viewers.delete(socket.id);
      if (!s.viewers.size) stopSession(joined);
    }
    joined = null;
  }
});

const room = (username) => 'u:' + username;

function createSession(username) {
  const s = { username, live: false, connection: null, ws: null, retryTimer: null, stopped: false, viewers: new Set() };

  const setLive = (live, error) => {
    s.live = live;
    s.error = error || '';
    io.to(room(username)).emit('status', { live, username, error: s.error });
  };

  const scheduleRetry = () => {
    if (s.stopped || s.retryTimer) return;
    s.retryTimer = setTimeout(() => {
      s.retryTimer = null;
      tryConnect();
    }, RETRY_MS);
  };

  function emitChat(user, comment) {
    comment = String(comment || '').trim();
    if (!comment) return;
    io.to(room(username)).emit('comment', {
      user: user?.uniqueId || user?.userId || user?.id || 'viewer',
      nickname: user?.nickname || user?.uniqueId || 'viewer',
      comment,
    });
  }
  function emitGift(user, d) {
    const streakable = d.giftType === 1 || d.giftDetails?.type === 1 || d.giftDetails?.combo === true;
    if (streakable && !d.repeatEnd) return;
    const count = Number(d.repeatCount || d.comboCount || 1);
    const diamonds = Number(d.diamondCount ?? d.giftDetails?.diamondCount ?? d.extendedGiftInfo?.diamond_count ?? 1);
    io.to(room(username)).emit('gift', {
      user: user?.uniqueId || user?.userId || user?.id || 'viewer',
      nickname: user?.nickname || user?.uniqueId || 'viewer',
      giftName: d.giftName || d.giftDetails?.giftName || d.giftDetails?.name || d.gift?.name || 'a gift',
      count,
      coins: diamonds * count,
    });
  }

  // ---- Path A: Euler Stream managed WebSocket (works on the free Community plan) ----
  let logged = 0;
  function connectEuler() {
    const key = process.env.SIGN_API_KEY;
    const url = `wss://ws.eulerstream.com?uniqueId=${encodeURIComponent(username)}&apiKey=${encodeURIComponent(key)}`;
    const ws = new WebSocket(url);
    s.ws = ws;
    ws.addEventListener('open', () => {
      console.log(`[@${username}] Euler WebSocket open`);
      setLive(true);
    });
    ws.addEventListener('message', (ev) => {
      let data;
      try { data = JSON.parse(typeof ev.data === 'string' ? ev.data : Buffer.from(ev.data).toString()); } catch { return; }
      const list = Array.isArray(data?.messages) ? data.messages : [data];
      for (const msg of list) {
        if (!msg || typeof msg !== 'object') continue;
        const type = String(msg.type || msg.event || msg.name || msg.messageType || msg.method || '');
        const d = msg.data ?? msg.message ?? msg.payload ?? msg;
        if (logged < 6) { logged++; console.log(`[@${username}] event ${type || '?'} keys=${Object.keys(d || {}).slice(0, 12).join(',')}`); }
        const user = d?.user || d?.userIdentity || msg.user;
        if (/chat/i.test(type) || (d?.comment !== undefined && user)) emitChat(user, d.comment ?? d.content);
        else if (/gift/i.test(type) || d?.giftId !== undefined || d?.giftDetails) emitGift(user, d);
      }
    });
    ws.addEventListener('close', (ev) => {
      if (s.stopped) return;
      const reasons = { 4005: 'Stream ended', 4401: 'Invalid Euler API key', 4403: 'Euler key has no permission', 4404: 'Not LIVE yet (or wrong username)', 4429: 'Too many connections on this Euler key', 4556: 'TikTok fetch error', 4557: 'Room info fetch error' };
      const why = reasons[ev.code] || `closed (${ev.code}${ev.reason ? ' ' + ev.reason : ''})`;
      console.log(`[@${username}] Euler WebSocket ${why}`);
      setLive(false, why + '. Retrying…');
      scheduleRetry();
    });
    ws.addEventListener('error', (ev) => {
      if (s.stopped || ws.readyState === WebSocket.OPEN) return;
      const msg = String(ev?.message || ev?.error?.message || 'network error');
      console.log(`[@${username}] Euler WebSocket error: ${msg}`);
      setLive(false, 'Could not reach Euler Stream: ' + msg.slice(0, 80) + '. Retrying…');
      try { ws.close(); } catch {}
      scheduleRetry();
    });
    setTimeout(() => {
      if (!s.stopped && s.ws === ws && ws.readyState === WebSocket.CONNECTING) {
        console.log(`[@${username}] Euler WebSocket connect timeout`);
        try { ws.close(); } catch {}
        setLive(false, 'Euler Stream connect timeout. Retrying…');
        scheduleRetry();
      }
    }, 20000);
  }

  // ---- Path B: direct connector (needs no key, but TikTok blocks most cloud servers) ----
  async function connectDirect() {
    if (s.connection) s.connection.removeAllListeners();
    const connection = new TikTokLiveConnection(username, { enableExtendedGiftInfo: true });
    s.connection = connection;
    connection.on(WebcastEvent.CHAT, (data) => emitChat(data.user || data, data.comment));
    connection.on(WebcastEvent.GIFT, (data) => emitGift(data.user || data, data));
    connection.on('disconnected', () => {
      if (s.stopped) return;
      console.log(`[@${username}] disconnected, retrying`);
      setLive(false);
      scheduleRetry();
    });
    try {
      const state = await connection.connect();
      if (s.stopped) return connection.disconnect?.();
      console.log(`[@${username}] connected to room ${state.roomId}`);
      setLive(true);
    } catch (err) {
      const msg = String(err?.message || err).slice(0, 400);
      console.log(`[@${username}] not connected: ${msg}`);
      setLive(false, friendlyError(msg));
      scheduleRetry();
    }
  }

  function tryConnect() {
    if (s.stopped) return;
    if (process.env.SIGN_API_KEY) connectEuler(); else connectDirect();
  }

  tryConnect();
  return s;
}

function friendlyError(msg) {
  const m = msg.toLowerCase();
  const key = process.env.SIGN_API_KEY ? 'key set' : 'NO SIGN_API_KEY';
  let hint = '';
  if (m.includes('not online') || m.includes('offline') || m.includes('not live') || m.includes('user_not_found') || m.includes("isn't online")) hint = 'Not LIVE yet or wrong username. ';
  else if (m.includes('lack of permission') || m.includes('permission')) hint = 'Euler key lacks permission (check plan/key). ';
  else if (m.includes('429') || m.includes('rate limit')) hint = 'Rate limited. ';
  else if (m.includes('403') || m.includes('blocked') || m.includes('captcha')) hint = 'TikTok blocked this server. ';
  return hint + '[' + key + '] ' + msg.replace(/\s+/g, ' ').slice(0, 140);
}

function stopSession(username) {
  const s = sessions.get(username);
  if (!s) return;
  s.stopped = true;
  clearTimeout(s.retryTimer);
  if (s.connection) {
    s.connection.removeAllListeners();
    try { s.connection.disconnect(); } catch {}
  }
  if (s.ws) { try { s.ws.close(1000); } catch {} }
  sessions.delete(username);
  console.log(`[@${username}] stopped (no game pages open)`);
}

server.listen(PORT, () => console.log(`Emoji Guess running on port ${PORT}`));
