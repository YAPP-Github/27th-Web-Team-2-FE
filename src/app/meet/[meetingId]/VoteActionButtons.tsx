'use client';

import Link from 'next/link';

import { trackEvent } from '@/shared/lib/amplitude';
import Button from '@/shared/ui/button/Button';

interface VoteActionButtonsProps {
  meetingId: string;
}

export function VoteActionButtons({ meetingId }: VoteActionButtonsProps) {
  const handleEditClick = () => {
    trackEvent('voter_vote_edit_cta_click');
  };

  const handleVoteClick = () => {
    trackEvent('voter_vote_start_cta_click');
  };

  return (
    <div className='fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-screen-sm bg-gray-50 p-4'>
      <div className='flex gap-3'>
        <Link
          href={`/meet/${meetingId}/edit`}
          className='flex-1'
          onClick={handleEditClick}
        >
          <Button variant='secondary' fullWidth>
            투표 수정하기
          </Button>
        </Link>
        <Link
          href={`/meet/${meetingId}/register`}
          className='flex-1'
          onClick={handleVoteClick}
        >
          <Button fullWidth>투표하기</Button>
        </Link>
      </div>
    </div>
  );
}
