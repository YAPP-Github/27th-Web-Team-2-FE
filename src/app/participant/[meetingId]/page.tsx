import { ReactCalendarVoteResultsCalendar } from '@/features/vote-results-calendar/ui/adapters/react-calendar';
import { Person } from '@/shared/types/common';
import { Dropdown } from '@/shared/ui/dropdown';
import { Header } from '@/shared/ui/header';
import { TopBar } from '@/shared/ui/top-bar';

// 1. Mock Data based on User Schema
const MOCK_DATA = {
  id: 'meeting-123',
  title: '신년 모임 날짜 투표',
  dates: [
    '2026-01-14',
    '2026-01-15',
    '2026-01-16',
    '2026-01-17',
    '2026-01-20',
    '2026-01-21',
    '2026-01-22',
  ], // Candidate dates
  maxParticipantCount: 0,
  participants: [
    {
      id: '1',
      name: '김철수',
      voteDates: ['2026-01-14', '2026-01-15', '2026-01-16'],
    },
    {
      id: '2',
      name: '이영희',
      voteDates: ['2026-01-14', '2026-01-15'],
    },
    {
      id: '3',
      name: '박민수',
      voteDates: ['2026-01-14', '2026-01-17'],
    },
    {
      id: '4',
      name: '최지혜',
      voteDates: ['2026-01-20'],
    },
    {
      id: '5',
      name: '정수빈',
      voteDates: ['2026-01-14', '2026-01-15', '2026-01-16', '2026-01-17'],
    },
  ],
};

// 2. Transform Logic
function getStatsFromMock(
  candidateDates: string[],
  participants: { id: string; name: string; voteDates: string[] }[],
) {
  return candidateDates.map((date) => {
    const can: Person[] = [];
    const cannot: Person[] = [];

    participants.forEach((p) => {
      if (p.voteDates.includes(date)) {
        can.push({ id: p.id, name: p.name });
      } else {
        cannot.push({ id: p.id, name: p.name });
      }
    });

    return {
      date,
      can,
      cannot,
    };
  });
}

interface ResultPageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { meetingId } = await params;

  // Derive stats
  const stats = getStatsFromMock(MOCK_DATA.dates, MOCK_DATA.participants);

  // Derive date range (min/max of candidate dates)
  const sortedDates = [...MOCK_DATA.dates].sort();
  const openRange = {
    start: sortedDates[0],
    end: sortedDates[sortedDates.length - 1],
  };

  // Extract participant names for the dropdown
  const participantNames = MOCK_DATA.participants.map((p) => p.name);

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <TopBar
        title='어쩔래미저쩔래님이 초대한 두쫀쿠투어두쫀'
        rightIcon='ic_other_share'
        className='bg-white'
      />

      <Header voteCount={MOCK_DATA.participants.length} />

      <div className='flex flex-col items-center px-5 py-6'>
        <div className='w-full space-y-4'>
          {/* Dropdown for participants */}
          <Dropdown participants={participantNames} className='mb-6' />

          <ReactCalendarVoteResultsCalendar
            month={openRange.start.slice(0, 7)}
            openRange={openRange}
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
}
