export interface CalendarEventData {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;       // YYYY-MM-DD
  timeBrt: string | null; // HH:MM or null
}

function formatUTCBasic(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${y}${m}${day}T${hh}${mm}${ss}Z`;
}

function getNextDayISO(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  dateObj.setDate(dateObj.getDate() + 1);
  const nextY = dateObj.getFullYear();
  const nextM = String(dateObj.getMonth() + 1).padStart(2, '0');
  const nextD = String(dateObj.getDate()).padStart(2, '0');
  return `${nextY}-${nextM}-${nextD}`;
}

export function getGoogleCalendarUrl(event: CalendarEventData): string {
  const { title, description, location, date, timeBrt } = event;
  let datesStr = "";
  if (timeBrt) {
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = timeBrt.split(':').map(Number);
    // BRT is UTC-3, so to get UTC we add 3 hours
    const start = new Date(Date.UTC(y, m - 1, d, hh + 3, mm, 0));
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
    datesStr = `${formatUTCBasic(start)}/${formatUTCBasic(end)}`;
  } else {
    const nextDay = getNextDayISO(date);
    datesStr = `${date.replace(/-/g, '')}/${nextDay.replace(/-/g, '')}`;
  }
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${datesStr}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
}

export function getOutlookCalendarUrl(event: CalendarEventData): string {
  const { title, description, location, date, timeBrt } = event;
  let timeParams = "";
  if (timeBrt) {
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = timeBrt.split(':').map(Number);
    // BRT is UTC-3, so to get UTC we add 3 hours
    const start = new Date(Date.UTC(y, m - 1, d, hh + 3, mm, 0));
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
    timeParams = `startdt=${start.toISOString()}&enddt=${end.toISOString()}`;
  } else {
    const nextDay = getNextDayISO(date);
    timeParams = `startdt=${date}&enddt=${nextDay}&allday=true`;
  }
  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&${timeParams}`;
}

export function downloadIcsFile(event: CalendarEventData): void {
  const { id, title, description, location, date, timeBrt } = event;
  
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Esse Dia Tem Jogo//NONSGML v1.0//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${id}@essediatemjogo.com.br`,
    `DTSTAMP:${formatUTCBasic(new Date())}`,
  ];

  if (timeBrt) {
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = timeBrt.split(':').map(Number);
    // BRT is UTC-3, so to get UTC we add 3 hours
    const start = new Date(Date.UTC(y, m - 1, d, hh + 3, mm, 0));
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
    icsLines.push(`DTSTART:${formatUTCBasic(start)}`);
    icsLines.push(`DTEND:${formatUTCBasic(end)}`);
  } else {
    const nextDay = getNextDayISO(date);
    const startStr = date.replace(/-/g, '');
    const endStr = nextDay.replace(/-/g, '');
    icsLines.push(`DTSTART;VALUE=DATE:${startStr}`);
    icsLines.push(`DTEND;VALUE=DATE:${endStr}`);
  }

  icsLines.push(`SUMMARY:${title}`);
  
  // Escape newlines and characters in description for ICS format
  const escapedDesc = description
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
  
  icsLines.push(`DESCRIPTION:${escapedDesc}`);
  icsLines.push(`LOCATION:${location}`);
  icsLines.push('END:VEVENT');
  icsLines.push('END:VCALENDAR');

  const icsString = icsLines.join('\r\n');
  
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
