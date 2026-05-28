# Personal Dashboard

A static, mobile-friendly personal performance dashboard inspired by Rowan Thistlebrooke's dashboard tutorial series.

The project is designed for Netlify drag-and-drop deployment. It uses plain HTML, CSS, and JavaScript, plus one zero-dependency Netlify Function for optional cross-device sync through Netlify Blobs.

## What's Included

- `index.html` - the main dashboard with a goal ticker, day progress ring, today/tomorrow goals, streaks, inline editing, reorder, queue, and push-to-tomorrow.
- `health.html` - supplement windows, missed-window warning pulse, running-low flags, and a dynamic hydration calculator using weight, age, workout time, and caffeine.
- `gym.html` - workout split selector, lift log, progressive overload recommendations, mini strength charts, and before/after photo slots.
- `weight102.html` and `weight1.html` - extra weight-tracking dashboard pages from the reference repository.
- `netlify/functions/store.mjs` - cross-device sync endpoint using Netlify Blobs directly, with no npm packages.
- `netlify.toml` - Netlify configuration for publishing the root folder and deploying the function.
- `tutorial-prompt (3).md` - original episode-one build prompt.
- `Phone and computer data sync` - original sync-change prompt.

## Main Features

- Dark, app-like UI with a fixed bottom navigation bar for mobile use.
- Manual Netlify deploy flow: drag the whole folder to Netlify.
- Home-screen friendly on iPhone or Android after deployment.
- Local-first persistence with `localStorage`.
- Netlify Blobs sync for dashboard state when deployed on Netlify.
- No build step, no package install, and no `package.json`.

## Synced State

The Netlify sync layer syncs these localStorage keys:

- `goals:YYYY-MM-DD`
- `goal_streak_v1`
- `health_dashboard_v1`
- `gym_dashboard_v1`

It intentionally avoids syncing API keys, secrets, or device-only preferences.

## Deploy To Netlify

1. Open Netlify and go to your site's Deploys page.
2. Drag the whole project folder onto the deploy drop zone.
3. Do not drag only `index.html`; the `netlify` folder and `netlify.toml` must be included.
4. After deploy, hard-refresh each device.
5. Test the sync function at:

```text
https://YOUR-SITE.netlify.app/.netlify/functions/store
```

It should return `{}` or saved JSON data, not a crash page.

## Add To Phone

1. Open the deployed Netlify URL on your phone.
2. Use the browser share menu.
3. Choose Add to Home Screen.
4. Reopen from the new icon after future Netlify deploys.

## Notes

The project keeps the original single-file dashboard approach for the main page, then adds focused companion pages for the broader health and gym ideas shown in the later tutorial notes. The pages are intentionally simple static files so they stay compatible with drag-and-drop Netlify deployment.
