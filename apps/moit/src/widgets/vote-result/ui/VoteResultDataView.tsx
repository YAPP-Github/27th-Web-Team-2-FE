'use client';

import Dropdown from '@repo/shared/ui/dropdown/Dropdown';
import { useEffect, useState } from 'react';

import { VoteResultsProps } from '@/entities/voteDateStat/dto/voteDateStat.dto';
import { ReactDatePickerVoteResultsCalendar } from '@/features/vote-results-calendar/ui/ReactDatepicker';
import { trackEvent } from '@/shared/lib/amplitude';

interface VoteResultDataViewProps {
  participantNames: string[];
  openRange: { start: string; end: string };
  stats: VoteResultsProps['stats'];
  hasVoted?: boolean;
}

export function VoteResultDataView({
  participantNames,
  openRange,
  stats,
  hasVoted = false,
}: VoteResultDataViewProps) {
  // Filter State
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null,
  );

  // 페이지 진입 시 이벤트 트래킹
  useEffect(() => {
    trackEvent('voter_view_main', {
      is_voted: hasVoted,
    });
  }, [hasVoted]);

  const handleParticipantSelect = (name: string) => {
    trackEvent('voter_filter_click', {
      filter_type: 'name_chip',
    });
    // Toggle logic: if clicking the already selected participant, deselect
    if (selectedParticipant === name) {
      setSelectedParticipant(null);
    } else {
      setSelectedParticipant(name);
    }
  };

  return (
    <div className='flex w-full flex-col items-center px-5'>
      <div className='w-full gap-2'>
        {/* Dropdown for participants */}
        <Dropdown
          participants={participantNames}
          selectedParticipant={selectedParticipant}
          onSelectParticipant={handleParticipantSelect}
          onToggle={() => trackEvent('voter_dropdown_click')}
          className='mb-2'
        />

        <ReactDatePickerVoteResultsCalendar
          month={openRange.start.slice(0, 7)}
          openRange={openRange}
          stats={stats}
          focusedParticipant={selectedParticipant}
        />
      </div>
    </div>
  );
}
