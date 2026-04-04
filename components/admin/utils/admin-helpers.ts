/**
 * Date formatter for the admin UI
 */
export const adminDateFormatter = new Intl.DateTimeFormat('sv-SE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Europe/Stockholm',
});

/**
 * Formats a date for display in admin tables
 */
export function formatDateForAdmin(date: Date | null | undefined): string {
  if (!date) return '–';
  return adminDateFormatter.format(date);
}
