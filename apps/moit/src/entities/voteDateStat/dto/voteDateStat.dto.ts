import { Person } from '@repo/shared/types/common';

export type VoteDateStat = {
  date: string; // YYYY-MM-DD
  can: Person[];
  cannot: Person[];
};

export type VoteResultsProps = {
  month: string; // YYYY-MM-DD format (representing the month) or just YYYY-MM
  openRange: { start: string; end: string };
  stats: VoteDateStat[];
};
