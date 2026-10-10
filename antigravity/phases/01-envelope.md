# Phase 1: Envelope intro

## Goal
The strongest first impression. The user taps a gold wax seal, the envelope opens, the card rises, then the invitation reveals.

## Prompt
```
Read PROJECT.md. Build Envelope.jsx with Framer Motion.
Sequence:
0.0-0.6s: cream envelope fades in with a slight scale 0.95 to 1. The gold seal gently pulses while idle, with the label "اضغط لفتح الدعوة" below.
On tap: 
 - 0.0-0.4s seal cracks into two halves that rotate slightly and fall away.
 - 0.3-1.0s the top flap rotates open (rotateX 0 to 180, transform-origin top).
 - 0.8-1.6s the card slides up out of the envelope.
 - hold 0.5s, then the envelope slides down and fades while the Invitation content fades in (1s).
Requirements:
- Tapping is the only way in (this gesture will later unlock audio). Expose onOpen() so Phase 6 can start music and sfx; for now call a stub audio.play('seal') and audio.play('open') in lib/audio.js that does nothing.
- Lock page scroll until opened.
- Respect prefers-reduced-motion: skip the sequence and fade directly.
- Draw the envelope with CSS/SVG (no images), using the palette.
Show me your plan first.
```

## Definition of done
- Works smoothly at 390x844, no layout jump when the envelope closes.
- Keyboard accessible (Enter/Space on the seal), focus moves to the invitation after opening.
- Reduced-motion path works.
- Screenshots at three moments: idle, mid-open, revealed.
