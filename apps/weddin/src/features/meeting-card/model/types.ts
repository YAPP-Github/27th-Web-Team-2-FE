export type MeetingCardData = {
  id: string;
  title: string;
  dDay: number; // e.g., 2 means "D-2"
  currentVotes: number;
  totalVotes: number;
  topDate: string; // e.g., "1월 29일 토요일"
};

export type MeetingCardProps = {
  meeting: MeetingCardData;
  className?: string;
};
