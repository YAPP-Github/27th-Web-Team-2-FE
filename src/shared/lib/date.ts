import { format, isAfter, isBefore, parse } from 'date-fns';

export const DATE_FORMAT = 'yyyy-MM-dd';

export function parseDate(dateStr: string) {
  return parse(dateStr, DATE_FORMAT, new Date());
}

export function formatDate(date: Date) {
  return format(date, DATE_FORMAT);
}

export function isDateDisabled(
  date: string,
  openRange: { start: string; end: string },
) {
  const target = parseDate(date);
  const start = parseDate(openRange.start);
  const end = parseDate(openRange.end);

  // openRange 범위 밖이면 disabled
  if (isBefore(target, start) || isAfter(target, end)) {
    return true;
  }
  return false;
}

export function isPastDate(date: string, today: string) {
  const target = parseDate(date);
  const todayDate = parseDate(today);
  return isBefore(target, todayDate);
}
