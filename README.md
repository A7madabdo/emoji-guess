# Emoji Guess — phone edition for TikTok LIVE

Viewers see the streamer's face on top and an emoji puzzle below. They guess in the
comments; the first correct guess wins points. Works in English and Arabic.
Runs in the phone's browser, so it needs to be put online once (free).

## 1. Put it online (one time, on a computer) — Render.com, free plan
1. Create a free account at github.com and at render.com.
2. On GitHub: New repository → name it `emoji-guess` → "uploading an existing file" → drag in
   everything from this folder (README.md, package.json, server.js, and the `public` folder) → Commit.
3. On Render: New → Web Service → connect the GitHub repo.
   - Build command: `npm install`
   - Start command: `npm start`
   - Instance type: Free
4. Click Deploy. After a few minutes Render shows a link like `https://emoji-guess-xxxx.onrender.com`.
   That is the game link. Send it to your friend.

(Railway, Fly.io, or Glitch also work. Any host that runs Node.js 18+ is fine.)

## 2. Going LIVE from the phone (iPhone or Android)
1. Open the game link in Safari (iPhone) or Chrome (Android).
2. Type the TikTok username that will go LIVE (without @) and tap **Start game**. Allow the camera.
3. Open TikTok → tap **+** → **LIVE** → choose **Screen share** (on some phones it's called
   *Mobile gaming*). Start the LIVE and begin sharing the screen.
4. Go back to the browser with the game. Viewers now see the face on top and the game below.
   The badge at the top turns pink: "Live chat connected".
   - If it says "Waiting for your LIVE…", the username is wrong or the LIVE hasn't started yet.
     It keeps retrying every 15 seconds.

To hide the browser address bar: Safari → Share → **Add to Home Screen** (iPhone) or Chrome → ⋮ → **Add to Home screen**
(Android), then open the game from that icon. It runs full-screen like an app.

Tip: turn off auto-lock on the phone so the screen stays on. Keep the phone charging.

## Buttons on the screen
- 🔄 switch front/back camera
- 📷 camera on/off
- ⏭ skip the current puzzle
- T open the test panel to type comments yourself (good for trying it before going live)

## Sound
Sound effects and a background music loop were generated with ElevenLabs. Drop the files into
`public/audio/` with the names listed in `public/audio/README.md`. Until then the game plays small
built-in synthesized sounds. 🔊 button (M key) mutes sound effects and music; 🎵 button (B key) toggles only the background music. If `music.mp3` is missing, a built-in calm lo-fi loop plays instead.

## Puzzles
90 puzzles in `public/puzzles.js`: movies, songs, sayings, silly everyday things, animals, Filipino food,
places and words, and brands. Each has a category shown on screen, and 🔥 hard ones pay double.
Most accept answers in English, Arabic or Filipino.

## Gifts = cheats
Any gift reveals a letter for everyone (a toast shows who sent it). Bigger gifts reveal more letters
(1 extra per 5 coins, max 3). Whoever gifted in a round gets **2× points** if they win it.
Change `COINS_PER_LETTER`, `MAX_GIFT_LETTERS`, `BOOST_MULTIPLIER` at the top of the script in `public/index.html`.
The test panel has a 🎁 button to try it.

## Customize
- Puzzles: edit `public/puzzles.js` (the first answer is shown on the tiles, the others also count).
- Timing: `ROUND_SECONDS`, `HINT_EVERY`, `PAUSE_SECONDS` at the top of the script in `public/index.html`.

## Connecting to TikTok (needs a free Euler Stream key)
TikTok blocks most cloud servers, so the game connects through Euler Stream's managed WebSocket,
which is included in their **free Community plan** (25 connections).
1. Sign up at eulerstream.com (free) and copy your API key.
2. On Render → your service → Environment → Add `SIGN_API_KEY` = the key → Save (it redeploys).
3. The account must be LIVE when you press Start. The badge shows the reason if it can't connect.
Without a key the game falls back to connecting to TikTok directly, which only works from a home PC.

## Notes
- The free Render plan sleeps after 15 minutes without visitors. The first open after that takes
  about a minute to wake up, so open the game link a couple of minutes before going LIVE.
- Comments are read with the unofficial `tiktok-live-connector` library. If TikTok changes
  something and it stops connecting, redeploy after running `npm update`.
- If the Render logs show rate-limit or signing errors, get a free key at eulerstream.com and
  add it in Render → Environment as `SIGN_API_KEY`.
