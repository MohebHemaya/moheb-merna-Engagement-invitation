# Phase 0: Foundation

## Goal
A running Vite + React project with the design tokens, RTL, fonts, config file and empty components.

## Prompt
```
Read PROJECT.md. Set up a Vite React (JavaScript) project with Tailwind CSS.
- Configure RTL (lang="ar", dir="rtl"), the Amiri font, and the palette as Tailwind theme colors (cream, gold, gold-dark, brown, brown-soft).
- Create src/config.js exactly as described, with placeholder values.
- Create empty placeholder components listed in the folder structure, plus pages/Invitation.jsx and pages/Admin.jsx, and add React Router with "/" and "/admin".
- Create GoldFrame.jsx: a reusable wrapper drawing the double gold frame.
- Add .env.example with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
- Add meta robots noindex and a favicon placeholder.
Show me your plan first.
```

## Definition of done
- `npm run dev` runs without warnings; page background is cream, text is brown, Amiri loads.
- `/` and `/admin` both render.
- Changing `config.js` names will later reflect everywhere (nothing hardcoded).
- Tailwind classes use logical properties.
