# Phase 3: Story timeline

## Goal
"قصتكم": a gold line that draws as the user scrolls, with 3-4 milestones. The first one is the childhood photo.

## Prompt
```
Read PROJECT.md. Build Story.jsx using GSAP + ScrollTrigger.
- Section title "قصتكم" with the diamond divider.
- A vertical gold line (SVG path or scaleY) that draws progressively with scroll (scrub).
- Items come from config.story (year, title, text, image). Alternate sides on desktop, single column on mobile with the line on the inline-start edge.
- Each item: when it enters the viewport, the photo transitions from grayscale to sepia and fades in; text slides in subtly (20px).
- Use placeholder content if config.story has fewer than 3 items.
- Kill ScrollTrigger instances on unmount. Respect prefers-reduced-motion (no scrub, simple fades).
Show me your plan first.
```

## Definition of done
- Smooth on a mid-range phone (no jank), no horizontal scroll.
- Line progress matches scroll position in both directions.
- Works with 1 to 6 items without layout bugs.
