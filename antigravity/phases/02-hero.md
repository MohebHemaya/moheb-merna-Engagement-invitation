# Phase 2: Hero, names, countdown

## Goal
The opening screen of the invitation: bismillah, framed photo, names, date, live countdown.

## Prompt
```
Read PROJECT.md. Build Hero.jsx and Countdown.jsx.
Layout (centered, mobile-first, inside GoldFrame):
1. "بسم الله الرحمن الرحيم" small, gold-dark.
2. "يتشرفان بدعوتكم لحضور خطوبتهما".
3. Photo from config.story[0].image in a gold 2px frame with 5px cream padding, 190x236 on mobile, object-fit cover, object-position 50% 62%.
   Animation: clip-path reveal from the bottom, and the filter develops from grayscale(1) to sepia(.5) over 2s.
4. Names from config (groom, diamond divider, bride). Reveal each name with a right-to-left clip-path/mask wipe or per-word stagger. DO NOT split into single letters (breaks Arabic joining).
5. Formatted date in Arabic (Intl.DateTimeFormat 'ar-EG').
6. Countdown (days, hours, minutes, seconds) in gold-bordered boxes using Arabic-Indic digits; each digit change gets a small flip/slide animation. Tick every second, pause when tab hidden, and show "الليلة هي الليلة" style message when the date arrives or passes (put the text in config).
7. A subtle scroll hint at the bottom.
Keep everything driven by config.js. Show me your plan first.
```

## Definition of done
- Countdown correct against `eventDateISO` (Cairo timezone), no hydration or flicker issues.
- Names never break letter joining.
- Looks correct from 360px to 1280px.
- No layout shift when the photo loads (width/height set).
