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
  const s = { username, live: false, connection: null, retryTimer: null, stopped: false, viewers: new Set() };

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

  async function tryConnect() {
    if (s.stopped) return;
    if (s.connection) s.connection.removeAllListeners();
    const options = { enableExtendedGiftInfo: true };
    if (process.env.SIGN_API_KEY) options.signApiKey = process.env.SIGN_API_KEY;
    const connection = new TikTokLiveConnection(username, options);
    s.connection = connection;

    connection.on(WebcastEvent.CHAT, (data) => {
      const user = data.user || data;
      const comment = String(data.comment || '').trim();
      if (!comment) return;
      io.to(room(username)).emit('comment', {
        user: user.uniqueId || user.userId || 'viewer',
        nickname: user.nickname || user.uniqueId || 'viewer',
        comment,
      });
    });

    // Gifts. Streakable gifts (giftType 1) arrive many times while the viewer taps;
    // we only send the final total when the streak ends.
    connection.on(WebcastEvent.GIFT, (data) => {
      const user = data.user || data;
      const streakable = data.giftType === 1;
      if (streakable && !data.repeatEnd) return;
      const count = Number(data.repeatCount || 1);
      const diamonds = Number(data.diamondCount ?? data.giftDetails?.diamondCount ?? data.extendedGiftInfo?.diamond_count ?? 1);
      io.to(room(username)).emit('gift', {
        user: user.uniqueId || user.userId || 'viewer',
        nickname: user.nickname || user.uniqueId || 'viewer',
        giftName: data.giftName || data.giftDetails?.giftName || 'a gift',
        count,
        coins: diamonds * count,
      });
    });

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
      if (err?.cause) console.log(`[@${username}] cause: ${String(err.cause?.message || err.cause).slice(0, 300)}`);
      console.log(`[@${username}] not connected: ${msg}`);
      setLive(false, friendlyError(msg));
      scheduleRetry();
    }
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
  sessions.delete(username);
  console.log(`[@${username}] stopped (no game pages open)`);
}

server.listen(PORT, () => console.log(`Emoji Guess running on port ${PORT}`));
