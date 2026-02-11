'use client';

import { trackEvent } from '@repo/shared/lib/amplitude';
import Button from '@repo/shared/ui/button/Button';
import Link from 'next/link';

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
    <div className='fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-screen-sm bg-white px-5 py-4 shadow-[0px_-7px_20px_10px_#ffffff]'>
      <div className='flex gap-2.5'>
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
