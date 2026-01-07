'use client';

import { useState } from 'react';

import { generateMockVoteData } from '@/entities/voteDateStat/mock';
import { ReactCalendarHostRangeSelector } from '@/features/host-range-selector/ui/adapters/react-calendar';
// Adapters - Host
import { ReactDatePickerHostRangeSelector } from '@/features/host-range-selector/ui/adapters/react-datepicker';
import { MultiDatePickerHostRangeSelector } from '@/features/host-range-selector/ui/adapters/react-multi-date-picker';
import { ReactCalendarVoteResultsCalendar } from '@/features/vote-results-calendar/ui/adapters/react-calendar';
// Adapters - Vote
import { ReactDatePickerVoteResultsCalendar } from '@/features/vote-results-calendar/ui/adapters/react-datepicker';
import { SegmentedControl } from '@/shared/ui/SegmentedControl';

const LIBRARIES = [
  { label: 'React Datepicker', value: 'datepicker' },
  { label: 'React Calendar', value: 'calendar' },
] as const;

const MODES = [
  { label: '(A) Vote Results', value: 'vote' },
  { label: '(B) Host Range', value: 'host' },
] as const;

type LibraryType = (typeof LIBRARIES)[number]['value'];
type ModeType = (typeof MODES)[number]['value'];

// Mock Config
const TODAY = '2025-12-10';
const VOTE_MONTH = '2025-12';
const OPEN_RANGE = { start: '2025-12-14', end: '2026-01-02' };
const MOCK_STATS = generateMockVoteData(VOTE_MONTH, OPEN_RANGE);

export function CalendarDemoWidget() {
  const [library, setLibrary] = useState<LibraryType>('datepicker');
  const [mode, setMode] = useState<ModeType>('vote');

  // Host Mode State
  const [hostRange, setHostRange] = useState<{ start?: string; end?: string }>(
    {},
  );

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
            library === 'datepicker' ? (
              <ReactDatePickerVoteResultsCalendar
                month={VOTE_MONTH}
                openRange={OPEN_RANGE}
                stats={MOCK_STATS}
              />
            ) : (
              <ReactCalendarVoteResultsCalendar
                month={VOTE_MONTH}
                openRange={OPEN_RANGE}
                stats={MOCK_STATS}
              />
            )
          ) : // Host Range Mode
          library === 'datepicker' ? (
            <ReactDatePickerHostRangeSelector
              today={TODAY}
              initial={hostRange}
              onChange={setHostRange}
            />
          ) : library === 'calendar' ? (
            <ReactCalendarHostRangeSelector
              today={TODAY}
              initial={hostRange}
              onChange={setHostRange}
            />
          ) : (
            <MultiDatePickerHostRangeSelector
              today={TODAY}
              initial={hostRange}
              onChange={setHostRange}
            />
          )}
        </div>
      </main>

      {mode === 'host' && (
        <div className='text-center text-xs text-slate-400'>
          Debug Value: {JSON.stringify(hostRange)}
        </div>
      )}
    </div>
  );
}
