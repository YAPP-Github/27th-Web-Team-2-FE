'use client';

import { useState } from 'react';

import { generateMockVoteData } from '@/entities/voteDateStat/mock';
import { useDateSelection } from '@/features/host-range-selector/lib';
// Adapters - Host
import { ReactDatepickerAdapter as ReactDatePickerHostRangeSelector } from '@/features/host-range-selector/ui/adapters/ReactDatepickerAdapter';
// import { MultiDatePickerHostRangeSelector } from '@/features/host-range-selector/ui/adapters/react-multi-date-picker';
// Adapters - Vote
import { ReactDatePickerVoteResultsCalendar } from '@/features/vote-results-calendar/ui/adapters/react-datepicker';
import { SegmentedControl } from '@/shared/ui/SegmentedControl';

const LIBRARIES = [{ label: 'React Datepicker', value: 'datepicker' }] as const;

const MODES = [
  { label: '(A) Vote Results', value: 'vote' },
  { label: '(B) Host Range', value: 'host' },
] as const;

type LibraryType = (typeof LIBRARIES)[number]['value'];
type ModeType = (typeof MODES)[number]['value'];

// Mock Config
// const TODAY = '2025-12-10';
const VOTE_MONTH = '2025-12';
const OPEN_RANGE = { start: '2025-12-14', end: '2026-01-02' };
const MOCK_STATS = generateMockVoteData(VOTE_MONTH, OPEN_RANGE);

export function CalendarDemoWidget() {
  const [library, setLibrary] = useState<LibraryType>('datepicker');
  const [mode, setMode] = useState<ModeType>('vote');

  // Host Mode State
  const { selectedDates, handleDateChange, formattedDates } =
    useDateSelection();

  return (
    <div className='mx-auto max-w-xl space-y-8 p-6'>
      <header className='space-y-4'>
        <h1 className='text-2xl font-bold text-slate-900'>Calendar Demo</h1>

        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className='flex flex-col gap-2'>
            <span className='text-xs font-semibold text-slate-500 uppercase'>
              Library
            </span>
            <SegmentedControl
              value={library}
              options={[...LIBRARIES]}
              onChange={setLibrary}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <span className='text-xs font-semibold text-slate-500 uppercase'>
              Mode
            </span>
            <SegmentedControl
              value={mode}
              options={[...MODES]}
              onChange={setMode}
            />
          </div>
        </div>
      </header>

      <main>
        <div className='min-h-[500px] p-1'>
          {mode === 'vote' ? (
            // Vote Results Mode
            <ReactDatePickerVoteResultsCalendar
              month={VOTE_MONTH}
              openRange={OPEN_RANGE}
              stats={MOCK_STATS}
            />
          ) : // Host Range Mode
          library === 'datepicker' ? (
            <ReactDatePickerHostRangeSelector
              selectedDates={selectedDates}
              onChange={handleDateChange}
            />
          ) : (
            // <MultiDatePickerHostRangeSelector
            //   today={TODAY}
            //   initial={hostRange}
            //   onChange={setHostRange}
            // />
            <div>MultiDatePicker not implemented</div>
          )}
        </div>
      </main>

      {mode === 'host' && (
        <div className='space-y-2 p-4 pt-0'>
          <div className='text-center text-xs text-slate-400'>
            Selected Dates: {selectedDates.length}
          </div>
          <div className='rounded-lg bg-slate-900 p-4 font-mono text-xs text-green-400 shadow-inner'>
            <p className='mb-2 text-slate-500'>{'// API Payload Preview'}</p>
            {JSON.stringify(
              {
                meetingId: 'sample-id',
                name: 'sample-name',
                voteDates: formattedDates,
              },
              null,
              2,
            )}
          </div>
        </div>
      )}
    </div>
  );
}
