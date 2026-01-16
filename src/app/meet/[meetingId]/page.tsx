import Link from 'next/link';

import { getMeetingById } from '@/entities/meet/api/getMeetingById';
import { type Participant } from '@/entities/meet/dto/meet.dto';
import { BASE_URL } from '@/shared/config/constants';
import { Person } from '@/shared/types/common';
import Button from '@/shared/ui/button/Button';
import { Header } from '@/shared/ui/header';
import { VoteResultDataView } from '@/widgets/vote-result/ui/VoteResultDataView';

import ParticipantHeader from './ParticipantHeader';

// Transform Logic
function getStatsFromParticipants(
  candidateDates: string[],
  participants: Participant[],
) {
  return candidateDates.map((date) => {
    const can: Person[] = [];
    const cannot: Person[] = [];

    participants.forEach((p) => {
      if (p.voteDates.includes(date)) {
        can.push({ id: String(p.id), name: p.name });
      } else {
        cannot.push({ id: String(p.id), name: p.name });
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
  // Fetch meeting data from API
  const meetingData = await getMeetingById(meetingId);
  // Derive stats
  const stats = getStatsFromParticipants(
    meetingData.dates,
    meetingData.participants,
  );

  // Derive date range (min/max of candidate dates)
  const sortedDates = [...meetingData.dates].sort();
  const openRange = {
    start: sortedDates[0],
    end: sortedDates[sortedDates.length - 1],
  };

  // Extract participant names for the dropdown
  const participantNames = meetingData.participants.map((p) => p.name);

  // 데이터 로드 시간 (HH:MM 형식)
  const now = new Date();
  const standardTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className='flex min-h-screen flex-col bg-gray-50 pt-14 pb-25'>
      <div className='fixed top-0 right-0 left-0 z-50 mx-auto w-full max-w-screen-sm bg-white'>
        <ParticipantHeader
          title={meetingData.title}
          url={`${BASE_URL}/meet/${meetingId}`}
          className='bg-white'
        />
      </div>

      <Header
        voteCount={meetingData.participants.length}
        standardTime={standardTime}
      />

      <VoteResultDataView
        participantNames={participantNames}
        openRange={openRange}
        stats={stats}
      />

      <div className='fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-screen-sm bg-gray-50 p-4'>
        <div className='flex gap-3'>
          <Link href={`/meet/${meetingId}/edit`} className='flex-1'>
            <Button variant='secondary' fullWidth>
              투표 수정하기
            </Button>
          </Link>
          <Link href={`/meet/${meetingId}/register`} className='flex-1'>
            <Button fullWidth>투표하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
