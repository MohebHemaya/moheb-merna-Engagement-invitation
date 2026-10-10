# Phase 6: Media (music, sound effects, video, gallery)

## Goal
Rich but controlled media. Audio starts only after the envelope tap, and a mute button is always visible.

## Prompt
```
Read PROJECT.md. Implement media.
1. lib/audio.js with Howler.js and an AudioProvider/context:
   - sfx: 'seal' and 'open' (tiny files in public/assets/sfx), 'send' for the message form.
   - music loop from config.musicSrc: starts when the envelope is opened (user gesture), fades in over 2s to volume 0.35.
   - AudioToggle.jsx: fixed round gold button (safe-area aware) to mute/unmute; remember the choice for the session.
   - Pause music when the tab is hidden, resume when visible.
   - If files are missing, fail silently.
   Wire audio.play('seal') and audio.play('open') into Envelope.jsx.
2. VideoBlock.jsx: only renders if config.videoSrc is set. Uses muted, loop, playsinline, preload="none", poster from config.videoPoster; plays only when in view (IntersectionObserver) and pauses when out. Gold frame around it. In lite mode show the poster only.
3. Gallery.jsx: 6-10 images from config.gallery in a masonry/grid, lazy-loaded with blur-up placeholders, and a lightbox (keyboard arrows/Esc, swipe on touch, focus trap). Hide the section if the gallery is empty.
Show me your plan first.
```

## Asset guidelines
- Music: royalty-free, 15-30s seamless loop, MP3 under 1MB.
- Video: 10-20s, under 3MB, MP4 (H.264) plus WebM.
- Images: WebP, max 1200px wide.

## Definition of done
- No audio plays before the first tap; mute works instantly.
- Video only plays while visible, and never downloads before it is near the viewport.
- Lightbox usable with keyboard and touch.
