'use client';

import { useState } from 'react';

import { VoteResultsProps } from '@/entities/voteDateStat/dto/voteDateStat.dto';
import { ReactDatePickerVoteResultsCalendar } from '@/features/vote-results-calendar/ui/ReactDatepicker';
import { Dropdown } from '@/shared/ui/dropdown';

interface VoteResultDataViewProps {
  participantNames: string[];
  openRange: { start: string; end: string };
  stats: VoteResultsProps['stats'];
}

export function VoteResultDataView({
  participantNames,
  openRange,
  stats,
}: VoteResultDataViewProps) {
  // Filter State
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null,
  );

  const handleParticipantSelect = (name: string) => {
    // Toggle logic: if clicking the already selected participant, deselect
    if (selectedParticipant === name) {
      setSelectedParticipant(null);
    } else {
      setSelectedParticipant(name);
    }
  };

  return (
    <div className='flex w-full flex-col items-center px-5 py-2'>
      <div className='w-full space-y-4'>
        {/* Dropdown for participants */}
        <Dropdown
          participants={participantNames}
          selectedParticipant={selectedParticipant}
          onSelectParticipant={handleParticipantSelect}
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
