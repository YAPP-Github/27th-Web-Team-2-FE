'use client';

import 'react-calendar/dist/Calendar.css'; // Import CSS

import { format } from 'date-fns';
import { useRef, useState } from 'react';
import Calendar from 'react-calendar';

import { VoteResultsProps } from '@/entities/voteDateStat/model';
import { calculateRank, isDateDisabled, parseDate } from '@/shared/lib/date';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/Badge';

import { VoteResultsShell } from '../VoteResultsShell';

export function ReactCalendarVoteResultsCalendar({
  openRange,
  stats,
}: VoteResultsProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const minDate = parseDate(openRange.start);
  const maxDate = parseDate(openRange.end);

  const selectedStat = selectedDate
    ? stats.find((s) => s.date === selectedDate) || null
    : null;

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const stat = stats.find((s) => s.date === dateStr);
    const votes = stat ? stat.can.length : 0;

    if (votes === 0) return;

    if (selectedDate === dateStr) {
      setSelectedDate(null);
    } else {
      setSelectedDate(dateStr);
    }
  };

  return (
    <VoteResultsShell
      selectedDate={selectedDate}
      onCloseDetail={() => setSelectedDate(null)}
      selectedStat={selectedStat}
      calendarRef={calendarRef}
    >
      <div className='react-calendar-custom-wrapper'>
        <Calendar
          locale='ko-KR'
          minDate={minDate}
          maxDate={maxDate}
          calendarType='gregory'
          formatDay={() => ''} // Hide default day number to prevent overlap
          tileContent={({ date, view }) => {
            if (view !== 'month') return null;
            const dateStr = format(date, 'yyyy-MM-dd');
            const stat = stats.find((s) => s.date === dateStr);
            const votes = stat ? stat.can.length : 0;
            const isSelected = selectedDate === dateStr;
            const disabled = isDateDisabled(dateStr, openRange);

            // Re-calculate basic props for all days
            const dayNumber = format(date, 'd');

            // Simple disable check for styling
            const isDisabledOrNoVotes = disabled || votes === 0;

            // Rank logic
            const simpleStats = stats.map((s) => ({
              date: s.date,
              count: s.can.length,
            }));
            const rank = calculateRank(simpleStats, dateStr);

            return (
              <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                {/* pointer-events-none on wrapper to let clicks pass through to button 
                    BUT we need to allow interaction if enabled. 
                    Actually, if the parent button handles click, we just display. 
                */}
                <div
                  className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-lg text-base font-normal transition-colors sm:h-10 sm:w-10', // Responsive size 1:1
                    isDisabledOrNoVotes
                      ? 'pointer-events-none text-slate-300'
                      : 'pointer-events-auto cursor-pointer text-slate-900',
                    isSelected
                      ? 'bg-blue-600! font-bold! text-white! shadow-md' // Solid blue for selected
                      : !isDisabledOrNoVotes
                        ? 'hover:bg-slate-100' // Hover for non-selected
                        : '',
                  )}
                >
                  {dayNumber}

                  {/* Badge */}
                  {votes > 0 && rank && rank <= 3 && (
                    <div className='absolute -top-3 -right-2'>
                      <Badge
                        variant={
                          rank === 1 ? 'rank1' : rank === 2 ? 'rank2' : 'rank3'
                        }
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
          }}
          onClickDay={handleDateClick}
          value={selectedDate ? parseDate(selectedDate) : null}
          activeStartDate={selectedDate ? undefined : minDate}
          prevLabel={<span className='text-lg text-slate-400'>‹</span>}
          nextLabel={<span className='text-lg text-slate-400'>›</span>}
          navigationLabel={({ date }) => (
            <span className='text-lg font-bold text-slate-900'>
              {format(date, 'M월')}
            </span>
          )}
          tileClassName={({ date, view }) => {
            if (view !== 'month') return '';
            const dateStr = format(date, 'yyyy-MM-dd');
            const stat = stats.find((s) => s.date === dateStr);
            const votes = stat ? stat.can.length : 0;

            // Always provide relative and basic layout for the tile
            const baseClasses = 'relative h-14 overflow-visible rounded-lg';

            if (isDateDisabled(dateStr, openRange) || votes === 0) {
              return cn(baseClasses, 'pointer-events-none !text-slate-300');
            }
            return baseClasses;
          }}
          next2Label={null}
          prev2Label={null}
        />
      </div>
    </VoteResultsShell>
  );
}
