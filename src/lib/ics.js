/**
 * Client-side ICS calendar generator and Google Calendar URL builder
 */

function formatIcsDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function generateIcs(eventConfig) {
  const { groom, bride, eventDateISO, venueName, venueCity } = eventConfig;

  const startDate = new Date(eventDateISO);
  // Default duration: 3 hours
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

  const startFormatted = formatIcsDate(startDate);
  const endFormatted = formatIcsDate(endDate);

  const summary = `خطوبة ${groom} و ${bride}`;
  const description = `نتشرف بحضوركم حفل خطوبة ${groom} و ${bride} في ${venueName}`;
  const location = `${venueName}${venueCity ? ` - ${venueCity}` : ''}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Engagement Invitation//AR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@engagement-invitation`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `engagement-${groom}-${bride}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(eventConfig) {
  const { groom, bride, eventDateISO, venueName, venueCity } = eventConfig;
  const startDate = new Date(eventDateISO);
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

  const startFormatted = formatIcsDate(startDate);
  const endFormatted = formatIcsDate(endDate);
  const title = encodeURIComponent(`خطوبة ${groom} و ${bride}`);
  const details = encodeURIComponent(`نتشرف بدعوتكم لحضور حفل خطوبة ${groom} و ${bride}`);
  const location = encodeURIComponent(`${venueName}${venueCity ? ` - ${venueCity}` : ''}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${details}&location=${location}`;
}
