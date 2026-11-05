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
    socket.emit('status', { live: s.live, username });
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

  const setLive = (live) => {
    s.live = live;
    io.to(room(username)).emit('status', { live, username });
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
    const options = {};
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
      console.log(`[@${username}] not connected: ${err?.message || err}`);
      setLive(false);
      scheduleRetry();
    }
  }

  tryConnect();
  return s;
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
