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
  const targetStat = stats.find((s) => s.date === targetDate);
  if (!targetStat || targetStat.count === 0) return null;

  // 1. 0표 제외하고 count만 추출하여 중복 제거 및 내림차순 정렬
  const uniqueCounts = Array.from(
    new Set(stats.filter((s) => s.count > 0).map((s) => s.count)),
  ).sort((a, b) => b - a);

  // 2. 현재 날짜의 count가 몇 번째 순위인지 확인 (0-based index + 1)
  const rank = uniqueCounts.indexOf(targetStat.count) + 1;

  return rank;
}
