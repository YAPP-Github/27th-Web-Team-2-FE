import { Person } from '@repo/shared/types/common';
import { addDays, format } from 'date-fns';

import { VoteDateStat } from './dto/voteDateStat.dto';

const NAMES = [
  '상민',
  '쭈니',
  '나용짱',
  '윤정',
  '호연왕자',
  '재민누나',
  '예진공주',
  '나용',
];

function getRandomPeople(count: number): Person[] {
  const shuffled = [...NAMES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((name) => ({ id: name, name }));
}

export function generateMockVoteData(
  monthStr: string,
  openRange: { start: string; end: string },
): VoteDateStat[] {
  // Generate stats for dates within a reasonable range of the month
  // Mock: 14~27 active, various votes

  const stats: VoteDateStat[] = [];
  const start = new Date(openRange.start);
  const end = new Date(openRange.end);

  let current = start;
  while (current <= end) {
    const dateStr = format(current, 'yyyy-MM-dd');

    // Random logic for demo
    const totalMembers = 8;
    const canCount = Math.floor(Math.random() * (totalMembers + 1)); // 0 to 8

    // Make specific dates interesting for demo
    // 20th: Max votes (Top 1)
    // 21st: 0 votes
    // 22nd: Tie with 23rd

    let forcedCanCount = canCount;

    if (dateStr.endsWith('12-20')) forcedCanCount = 8;
    if (dateStr.endsWith('12-21')) forcedCanCount = 0;
    if (dateStr.endsWith('12-22')) forcedCanCount = 5;
    if (dateStr.endsWith('12-23')) forcedCanCount = 5;

    // New Mock Data for Jan
    if (dateStr.endsWith('01-01')) forcedCanCount = 4;
    if (dateStr.endsWith('01-02')) forcedCanCount = 6;

    const people = getRandomPeople(forcedCanCount);
    // The rest are cannot
    const cannotPeople = NAMES.filter(
      (n) => !people.find((p) => p.name === n),
    ).map((n) => ({ id: n, name: n }));

    stats.push({
      date: dateStr,
      can: people,
      cannot: cannotPeople,
    });

    current = addDays(current, 1);
  }

  return stats;
}
