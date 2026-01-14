'use client';

// Unused imports removed
import 'react-datepicker/dist/react-datepicker.css';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';

import { VoteResultsProps } from '@/entities/voteDateStat/model';
import { calculateRank, isDateDisabled, parseDate } from '@/shared/lib/date';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/Badge';

import { VoteResultsShell } from '../VoteResultsShell';

export function ReactDatePickerVoteResultsCalendar({
  openRange,
  stats,
}: VoteResultsProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Convert string dates to Date objects for the library
  const minDate = parseDate(openRange.start);
  const maxDate = parseDate(openRange.end);

  const selectedStat = selectedDate
    ? stats.find((s) => s.date === selectedDate) || null
    : null;

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    const dateStr = format(date, 'yyyy-MM-dd');

    // Check if disabled logic (should match render logic)
    const stat = stats.find((s) => s.date === dateStr);
    const votes = stat ? stat.can.length : 0;

    if (votes === 0) return; // Cannot select 0 vote days

    if (selectedDate === dateStr) {
      setSelectedDate(null); // Toggle off
    } else {
      setSelectedDate(dateStr);
    }
  };

  const renderDayContents = (day: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');

    // Basic disable check (range)
    if (isDateDisabled(dateStr, openRange)) {
      return <span className='text-slate-300'>{day}</span>;
    }

    const stat = stats.find((s) => s.date === dateStr);
    const votes = stat ? stat.can.length : 0;

    // Rank
    const simpleStats = stats.map((s) => ({
      date: s.date,
      count: s.can.length,
    }));
    const rank = calculateRank(simpleStats, dateStr);

    const isSelected = selectedDate === dateStr;
    const disabled = isDateDisabled(dateStr, openRange);

    return (
      <div className='flex h-full w-full items-center justify-center py-1'>
        <div
          className={cn(
            'relative flex h-9 w-9 items-center justify-center rounded-lg text-base font-normal transition-colors sm:h-10 sm:w-10', // Responsive size 1:1
            disabled || votes === 0 ? 'text-slate-300' : 'text-slate-900',
            isSelected
              ? 'bg-blue-600 font-bold text-white shadow-md' // Solid blue for selected
              : !disabled && votes > 0
                ? 'cursor-pointer hover:bg-slate-100' // Hover for non-selected
                : '',
          )}
        >
          {day}

          {/* Rank Badge - Top Right */}
          {votes > 0 && rank !== null && rank <= 3 && (
            <div className='absolute -top-3 -right-2'>
              <Badge
                variant={rank === 1 ? 'rank1' : rank === 2 ? 'rank2' : 'rank3'}
                size='sm'
                className='h-5 min-w-[20px] justify-center px-1 py-0 text-[10px] shadow-sm'
              >
                {rank}위
              </Badge>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <VoteResultsShell
      selectedDate={selectedDate}
      onCloseDetail={() => setSelectedDate(null)}
      selectedStat={selectedStat}
      calendarRef={calendarRef}
    >
      <div className='react-datepicker-custom-wrapper flex w-full justify-center'>
        <DatePicker
          locale={ko}
          inline
          minDate={minDate}
          maxDate={maxDate}
          renderDayContents={renderDayContents}
          onChange={handleDateClick}
          selected={selectedDate ? parseDate(selectedDate) : null}
          calendarClassName='!border-none !shadow-none !font-sans'
          dayClassName={() => 'bg-transparent'} // Clear default styles
        />
      </div>
    </VoteResultsShell>
  );
}
