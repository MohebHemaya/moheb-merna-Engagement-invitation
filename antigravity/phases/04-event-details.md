# Phase 4: Event details

## Goal
Where and when, with one-tap map and calendar.

## Prompt
```
Read PROJECT.md. Build EventDetails.jsx and lib/ics.js.
- Cards inside the gold-frame language showing: date (full Arabic date and weekday), time, venue name and city, optional dress code (hide if empty).
- Button "افتح الخريطة" opening config.mapsUrl in a new tab (rel="noopener").
- Button "أضف للتقويم" that downloads an .ics file generated client-side (VEVENT with DTSTART/DTEND in Africa/Cairo, 3 hours default duration, SUMMARY from names, LOCATION from venue) and a secondary link for Google Calendar.
- Cards reveal with a light fade-up when scrolled into view.
Show me your plan first.
```

## Definition of done
- The .ics opens correctly on iPhone and Android, with the right local time.
- Map button works with the real link.
- Nothing hardcoded; all from config.
