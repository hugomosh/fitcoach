# FitCoach — Anti-Sedentary Training PWA

A progressive web app designed specifically for desk workers. Combines strength training with PT-style evening recovery to counter the effects of prolonged sitting.

## Features

- **💪 Strength Workouts** — 2-week progressive program targeting posterior chain, upper back, core stability, and hip mobility
- **🌙 Evening Recovery** — Physical therapy-style wind-down with foam rolling, mobility, activation, and deep stretching
- **📊 Progress Tracking** — Session history, streak tracking, weight logging, and pain notes
- **🎥 Video Integration** — Every exercise links to YouTube and Instagram tutorials
- **🗣️ Coach Messages** — Motivational cues throughout your workout
- **📦 Import/Export** — Backup your data or share routines as JSON
- **📱 PWA** — Install on your phone, works offline

## Exercise Data

All exercises are stored as JSON files in `src/data/`:
- `exercises.json` — Full database of 60+ exercises (warmup, strength, cooldown, recovery)
- `programs.json` — 2-week workout schedules + recovery sessions + coach messages

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- vite-plugin-pwa (Workbox)
- localStorage for persistence
- GitHub Pages for hosting

## Deploy to GitHub Pages

### Option 1: Automatic (GitHub Actions)

1. Create a new GitHub repo
2. Push this code to `main`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/fitcoach.git
   git branch -M main
   git push -u origin main
   ```
3. Go to **Settings → Pages → Source** and select **GitHub Actions**
4. The workflow will build and deploy automatically on every push
5. Your app will be live at `https://YOUR_USERNAME.github.io/fitcoach/`

### Option 2: Manual (gh-pages branch)

```bash
npm install
npm run build
npm run deploy
```

Then in your repo settings, set Pages source to the `gh-pages` branch.

### Changing the base path

If your repo is named something other than `fitcoach`, update the `base` in `vite.config.js`:

```js
base: '/your-repo-name/',
```

Also update the `start_url` and `scope` in the PWA manifest inside `vite.config.js`.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173/fitcoach/

## Customizing Exercises

Edit `src/data/exercises.json` to add/remove exercises. Each exercise has:
- `id` — Unique identifier (referenced in programs.json)
- `name` — Display name
- `reps` or `duration` — How many or how long
- `sets` — Number of sets
- `videoQuery` — YouTube search query for form videos
- `muscle` — Target muscle group
- `icon` — Emoji icon
- `cue` / `why` — (recovery exercises) Form cues and rationale

Edit `src/data/programs.json` to change which exercises appear on which day.

## License

MIT
