# Engagement Invitation Website

Single-page Arabic (RTL) engagement invitation. Guests receive the link on WhatsApp, mostly on mid-range phones with unreliable internet. Guests can leave a message; only the owner can read messages (via /admin).

## Stack
- Vite + React (JavaScript), Tailwind CSS
- Framer Motion (UI transitions), GSAP + ScrollTrigger (scroll timeline)
- Howler.js (audio), optional Lottie for small vector animations
- Supabase (messages table + Auth for admin)
- Deploy: Vercel (GitHub integration)

## Language and direction
- Arabic only. `<html lang="ar" dir="rtl">`.
- Use Tailwind logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`), never `ml/mr/pl/pr` for layout.
- Display numbers with Arabic-Indic digits via `Intl.NumberFormat('ar-EG')`.
- NEVER split Arabic text into single letters for animation: it breaks letter joining. Animate by word, line, or with a clip-path/mask wipe (right to left).

## Design tokens (classic luxe)
| Token | Value |
|---|---|
| cream | #F6EFE0 |
| gold | #B08D3C |
| gold-dark | #8D6F2B |
| brown | #3B2F1E |
| brown-soft | #6B5A3A |

- Font: Amiri (400, 700) from Google Fonts with `font-display: swap` and a serif fallback.
- Frame language: double gold frame (outer 1.5px, inner 0.5px, 5px apart), diamond divider (line, rotated 7px square, line), gold-bordered boxes for countdown.
- Photos: `filter: sepia(.5) contrast(1.03)`, gold 2px border with 5px cream padding.
- Buttons: solid gold, cream text, 3px radius. No gradients, no heavy shadows.

## Content
All copy and facts live in `src/config.js` so they can be edited in one place:

```js
export const config = {
  groom: "أحمد",
  bride: "سارة",
  eventDateISO: "2026-11-15T19:00:00+02:00",
  timezone: "Africa/Cairo",
  venueName: "قاعة النيل",
  venueCity: "الجيزة",
  mapsUrl: "https://maps.google.com/?q=...",
  dressCode: "",
  story: [
    { year: "", title: "بدأت من زمان", text: "", image: "/assets/couple-child.webp" },
  ],
  gallery: [],
  musicSrc: "/assets/music.mp3",
  videoSrc: "",
  videoPoster: "",
};
```
Names, date and venue above are placeholders. Never hardcode them in components.

## Folder structure
```
src/
  config.js
  components/ Envelope, Hero, Countdown, Story, EventDetails, Gallery, VideoBlock,
              MessageForm, AudioToggle, Preloader, Particles, GoldFrame
  hooks/      useReducedMotion, useLiteMode, useCountdown
  lib/        supabaseClient.js, ics.js, audio.js
  pages/      Invitation.jsx, Admin.jsx
public/assets/  couple-child.webp, music.mp3, sfx/, gallery/, video/, og.jpg
```

## Animation principles
- Five orchestrated moments only: envelope opening, hero reveal, photo "development", scroll timeline, thank-you petals. Everything else is subtle (hover, small fades).
- Durations 0.4-1.2s, ease-out; avoid bouncy easings (classic mood).
- Animate only `transform` and `opacity` where possible.
- Respect `prefers-reduced-motion` everywhere (skip or shorten).
- Lite mode (weak device / slow network / save-data): no particles, video replaced by poster image, shorter animations.

## Performance budget
- First load under 1.5MB (before the user taps "open"). Music, video and gallery load later.
- Images: WebP, max width 1200px, `loading="lazy"` except above the fold, always set width/height.
- Video: under 3MB, MP4 (H.264) + WebM, `muted loop playsinline preload="none"`, with a poster; plays only when in view.
- Audio: one music loop (MP3, under 1MB) plus tiny sound effects.

## Security
- Supabase keys only in `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`); commit `.env.example` only.
- RLS enabled. Guests can only INSERT. Only the admin email can SELECT/DELETE. Disable public sign-ups in Supabase Auth.
- `/admin` is not linked anywhere and the site is `noindex`.

## Working agreement for the agent
1. Read this file first. Work on ONE phase at a time from `phases/`.
2. Produce a short plan and wait for approval before coding.
3. After each phase: run the app, open it at 390x844 (mobile) and 1280x800, take screenshots, and report what you verified.
4. Do not add heavy dependencies without asking. Keep components small and typed with clear props.
5. Keep all text editable from `config.js`. Commit after each phase with a clear message.
