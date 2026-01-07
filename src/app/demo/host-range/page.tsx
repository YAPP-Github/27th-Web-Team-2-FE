'use client';

import React, { useState } from 'react';

import { ReactCalendarAdapter } from '@/features/host-range-selector/ui/adapters/ReactCalendarAdapter';
import { ReactDatepickerAdapter } from '@/features/host-range-selector/ui/adapters/ReactDatepickerAdapter';
import { ConfirmBottomSheet } from '@/features/host-range-selector/ui/ConfirmBottomSheet';
import { VoteResultsShell } from '@/features/vote-results-calendar/ui/VoteResultsShell';
import { Button } from '@/shared/ui/Button';
import { SegmentedControl } from '@/shared/ui/SegmentedControl';

const LIBRARIES = [
  { value: 'react-datepicker', label: 'react-datepicker' },
  { value: 'react-calendar', label: 'react-calendar' },
];

const MODES = [
  { value: 'vote-results', label: 'A: Vote Results' },
  { value: 'host-range', label: 'B: Host Range Selector' },
];

export default function HostRangeDemoPage() {
  const [selectedLibrary, setSelectedLibrary] = useState('react-datepicker'); // Default to datepicker as per user focus
  const [selectedMode, setSelectedMode] = useState('host-range');

  // Host Range State (Date[] of selected days)
  const [hostSelectedDates, setHostSelectedDates] = useState<Date[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleCreateMeeting = () => {
    if (hostSelectedDates.length > 0) {
      setIsConfirmOpen(true);
    }
  };

  const handleConfirm = (autoVote: boolean) => {
    setIsConfirmOpen(false);
    if (autoVote) {
      alert(
        `[가능해요] 주최자 자동 투표: TRUE, 선택 날짜(${hostSelectedDates.length}개) 반영됨.`,
      );
      console.log('Auto Vote Dates:', hostSelectedDates);
    } else {
      alert(`[직접 투표하기] 주최자 자동 투표: FALSE.`);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6 pb-32'>
      <h1 className='mb-6 text-2xl font-bold'>Calendar Demo (Restart)</h1>

      <div className='mb-8 space-y-4'>
        <div className='space-y-4 rounded-xl bg-white p-4 shadow-sm'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-500'>
              Library
            </label>
            <SegmentedControl
              options={LIBRARIES}
              value={selectedLibrary}
              onChange={setSelectedLibrary}
            />
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-500'>
              Mode
            </label>
            <SegmentedControl
              options={MODES}
              value={selectedMode}
              onChange={setSelectedMode}
            />
          </div>
        </div>
      </div>

      <div className='min-h-[400px] rounded-2xl bg-white p-6 shadow-sm'>
        {selectedMode === 'vote-results' ? (
          <div className='py-10 text-center'>
            <p className='mb-4 text-gray-500'>Vote Results Mode</p>
            <VoteResultsShell
              selectedDate={null}
              selectedStat={null}
              onCloseDetail={() => {}}
            >
              <div className='rounded bg-gray-50 p-8 text-center text-gray-400'>
                Placeholder for Vote Results
              </div>
            </VoteResultsShell>
          </div>
        ) : (
          <div className='animate-in fade-in duration-300'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-bold'>Host Range Selector</h2>
              <span className='text-sm font-medium text-blue-500'>
                Selected: {hostSelectedDates.length}
              </span>
            </div>

            {selectedLibrary === 'react-calendar' && (
              <ReactCalendarAdapter
                selectedDates={hostSelectedDates}
                onChange={setHostSelectedDates}
              />
            )}

            {selectedLibrary === 'react-datepicker' && (
              <ReactDatepickerAdapter
                selectedDates={hostSelectedDates}
                onChange={setHostSelectedDates}
              />
            )}
          </div>
        )}
      </div>

      {selectedMode === 'host-range' && (
        <div className='safe-area-bottom fixed right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-4 pb-8'>
          <Button
            className='w-full rounded-xl bg-gray-900 py-4 text-lg font-bold text-white disabled:bg-gray-300'
            disabled={hostSelectedDates.length === 0}
            onClick={handleCreateMeeting}
          >
            모임 만들기
          </Button>
        </div>
      )}

      <ConfirmBottomSheet
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
