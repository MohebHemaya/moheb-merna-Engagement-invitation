# Phase 8: Deploy and testing

## Steps
1. Push the repo to GitHub (make sure `.env` is in `.gitignore`).
2. Import the repo in Vercel (framework preset: Vite).
3. Add environment variables in Vercel: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
4. Add `vercel.json` so deep links like /admin work:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
5. Optional: connect a custom domain.
6. In Supabase Auth settings, add the production URL to the allowed redirect/site URLs.

## Prompt (for the agent)
```
Read PROJECT.md. Prepare for deployment: add vercel.json with the SPA rewrite, verify .gitignore excludes .env, make sure the production build passes (npm run build), and write a short DEPLOY.md. Then run the build and report bundle sizes.
```

## Test checklist
- [ ] iPhone Safari and Android Chrome: envelope opens, music starts after tap, mute works
- [ ] Slow 3G throttling: preloader shows progress, nothing breaks
- [ ] Message sent from a phone appears in /admin
- [ ] A visitor cannot read messages (anon key select returns nothing)
- [ ] /admin is not indexed and not linked
- [ ] WhatsApp link preview shows title and image
- [ ] Map and calendar buttons work with the real data
- [ ] Reduced motion on: site still fully usable
- [ ] Countdown matches Cairo time
- [ ] Replace ALL placeholders in config.js (names, date, venue, maps link, texts)
- [ ] Send the link to 2-3 friends first and collect feedback
