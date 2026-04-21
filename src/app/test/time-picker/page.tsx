'use client';

import { useState } from 'react';

import { formatTime } from '@/features/time-range-select/lib/timeUtils';
import type { TimeValue } from '@/features/time-range-select/model/types';
import TimeRangePicker from '@/features/time-range-select/ui/TimeRangePicker';
import Button from '@/shared/ui/button/Button';

export default function TimePickerTestPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [range, setRange] = useState<{
    startTime: TimeValue;
    endTime: TimeValue;
  } | null>(null);

  const isReady = !isEnabled || range !== null;

  return (
    <main className='flex min-h-screen flex-col items-center bg-white'>
      <div className='w-full max-w-sm'>
        <TimeRangePicker
          isEnabled={isEnabled}
          onEnabledChange={setIsEnabled}
          onRangeChange={setRange}
        />

        <p className='px-5 pb-2 text-center text-sm text-gray-400'>
          {range
            ? `${formatTime(range.startTime)} ~ ${formatTime(range.endTime)}`
            : '범위 미설정'}
        </p>

        <div className='px-5 pb-6'>
          <Button fullWidth disabled={!isReady}>
            모임 만들기
          </Button>
        </div>
      </div>
    </main>
  );
}
