# The Five Archetypes — quiz

A 12-question profiler that maps people onto five product-work archetypes
(Prototyper, Builder, Sweeper, Grower, Maintainer), inspired by a post by
Boris Cherny (@bcherny).

Built with Vite + React + Tailwind. Single component, no backend, no data
stored anywhere.

## Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Edit `src/App.jsx` and it hot-reloads.

## Build for production

```bash
npm run build
```

Outputs a static site into `dist/`. You can open `dist/index.html` directly
or run `npm run preview` to serve it locally exactly as it will appear once
deployed.

## Deploy — Vercel (recommended)

1. Push this folder to a new GitHub repo (see "Push to GitHub" below).
2. Go to vercel.com, sign in with GitHub, click **Add New → Project**.
3. Select the repo. Vercel auto-detects Vite — leave the defaults
   (Build command `npm run build`, Output directory `dist`).
4. Click **Deploy**. You get a live URL in about a minute
   (`archetype-quiz.vercel.app` or similar).
5. Optional: Project Settings → Domains → add a custom domain or subdomain
   you own (e.g. `archetypes.yourdomain.com`).

Every future `git push` to `main` auto-redeploys.

## Deploy — Netlify (equally simple, same flow)

1. Push to GitHub.
2. netlify.com → **Add new site → Import an existing project** → pick the repo.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Deploy. Custom domain works the same way as Vercel.

## Push to GitHub

From inside this folder:

```bash
git init
git add .
git commit -m "Five Archetypes quiz"
git branch -M main
git remote add origin https://github.com/<your-username>/archetype-quiz.git
git push -u origin main
```

Create the empty repo on GitHub first (github.com/new) if it doesn't exist
yet, then run the commands above.

## Notes

- The display font (Archivo Narrow) loads from Google Fonts via a `<link>`
  tag in `index.html` — no extra setup needed.
- Tailwind is configured to scan `index.html` and everything in `src/`, so
  no class purging issues once built.
- The result includes a credit block linking the framework back to the
  original Cherny post — keep that if you republish or adapt this.
