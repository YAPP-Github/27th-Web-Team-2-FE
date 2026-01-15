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

// 랭킹 계산 유틸
export function calculateRank(
  stats: { date: string; count: number }[],
  targetDate: string,
): number | null {
  // 1. count 내림차순, 2. date 오름차순 (빠른 날짜 우선)
  const sorted = [...stats].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.date.localeCompare(b.date);
  });

  // 0표 제외
  const validSorted = sorted.filter((s) => s.count > 0);

  const index = validSorted.findIndex((s) => s.date === targetDate);
  if (index === -1) return null;
  return index + 1; // 1-based rank
}
