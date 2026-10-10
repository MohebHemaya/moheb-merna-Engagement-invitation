# Phase 7: Polish and performance

## Goal
Make it feel premium and run well on weak phones.

## Prompt
```
Read PROJECT.md. Polish and optimize.
1. Preloader.jsx: gold-framed loading screen with a real progress percentage (preload only critical assets: fonts, hero photo, envelope), then hand over to the Envelope.
2. Particles.jsx: subtle gold dust on a single canvas, max 40 particles, pauses when offscreen or tab hidden, disabled in lite mode and with reduced motion.
3. hooks/useLiteMode.js: true if navigator.connection.saveData, effectiveType is 'slow-2g'/'2g'/'3g', deviceMemory <= 2, or hardwareConcurrency <= 4. Provide it via context and use it to reduce animation durations, disable particles, and swap video for poster.
4. hooks/useReducedMotion.js wired into all animations.
5. SEO/share: Open Graph and Twitter tags (title, description in Arabic, og.jpg 1200x630), theme-color cream, favicon, meta robots noindex.
6. Optimize: code-split Admin and Gallery (lazy), preload the Amiri font subset, confirm images have width/height.
7. Run Lighthouse (mobile) and report scores.
Show me your plan first.
```

## Definition of done
- Initial payload before the tap is under 1.5MB.
- Lighthouse mobile: Performance 85+, no accessibility errors.
- Animations stay smooth with 4x CPU throttling in DevTools.
- Pasting the link in WhatsApp shows a correct preview image and title.
