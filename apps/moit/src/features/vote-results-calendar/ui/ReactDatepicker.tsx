'use client';

import Icon from '@repo/shared/ui/icon/Icon';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';

import { VoteResultsProps } from '@/entities/voteDateStat/dto/voteDateStat.dto';
import { calculateRank } from '@/entities/voteDateStat/lib/calculateRank';
import { trackEvent } from '@/shared/lib/amplitude';
import { isDateDisabled, parseDate } from '@/shared/lib/date';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/Badge';

import { VoteResultsShell } from './VoteResultsShell';

export function ReactDatePickerVoteResultsCalendar({
  openRange,
  stats,
  focusedParticipant,
}: VoteResultsProps & { focusedParticipant?: string | null }) {
  const [rawSelectedDate, setRawSelectedDate] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const minDate = parseDate(openRange.start);
  const maxDate = parseDate(openRange.end);

  const selectedDate = (() => {
    if (!rawSelectedDate) return null;

    if (focusedParticipant) {
      const stat = stats.find((s) => s.date === rawSelectedDate);
      const isParticipantPossible = stat?.can.some(
        (p) => p.name === focusedParticipant,
      );
      if (!isParticipantPossible) return null;
    }

    return rawSelectedDate;
  })();

  const selectedStat = selectedDate
    ? stats.find((s) => s.date === selectedDate) || null
    : null;

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    const stat = stats.find((s) => s.date === dateStr);

    if (!stat) return;

    if (focusedParticipant) {
      const isParticipantPossible = stat.can.some(
        (p) => p.name === focusedParticipant,
      );
      if (!isParticipantPossible) return;
    }

    trackEvent('voter_date_cell_click');

    if (selectedDate === dateStr) {
      setRawSelectedDate(null);
    } else {
      setRawSelectedDate(dateStr);
      // 날짜 선택 시 voter_view_voter_count 이벤트
      trackEvent('voter_view_voter_count', {
        count: stat.can.length,
      });
    }
  };

  const renderDayContents = (day: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');

    const stat = stats.find((s) => s.date === dateStr);
    const votes = stat ? stat.can.length : 0;
    const isCandidate = !!stat;

    const simpleStats = stats.map((s) => ({
      date: s.date,
      count: s.can.length,
    }));
    const rank = calculateRank(simpleStats, dateStr);

    const isSelected = selectedDate === dateStr;

    let bgClass = '';
    let textClass = 'text-slate-900';

    let isFilteredOut = false;
    if (focusedParticipant && stat) {
      const isParticipantPossible = stat.can.some(
        (p) => p.name === focusedParticipant,
      );
      if (!isParticipantPossible) {
        isFilteredOut = true;
      }
    }

    if (isCandidate) {
      if (isFilteredOut) {
        bgClass = '';
        textClass = 'text-slate-900';
      } else {
        if (votes > 0) {
          if (focusedParticipant) {
            bgClass = 'bg-gray-800';
            textClass = 'text-text-inverse';
          } else if (rank && rank <= 3) {
            bgClass = 'bg-primary-default shadow-sm';
            textClass = 'text-text-inverse';
          } else {
            bgClass = 'bg-primary-subtlest';
            textClass = 'text-gray-900';
          }
        } else {
          bgClass = 'hover:bg-slate-100';
          textClass = 'text-slate-900';
        }
      }
    } else {
      textClass = 'text-slate-300';
    }

    const selectedClass = isSelected
      ? 'ring-2 ring-blue-100 ring-offset-2'
      : '';

    const isInteractive =
      isCandidate && !isDateDisabled(dateStr, openRange) && !isFilteredOut;

    return (
      <div className='flex h-full w-full items-center justify-center py-1'>
        <div
          className={
            cn(
              'relative flex h-9 w-9 items-center justify-center rounded-sm transition-colors sm:h-10 sm:w-10',
              bgClass,
              textClass,
              selectedClass,
              isInteractive && !isSelected && 'hover:brightness-95',
              !isInteractive && 'pointer-events-none text-slate-300',
              isFilteredOut && 'text-slate-900',
              isInteractive && 'pointer-events-auto cursor-pointer',
            ) + ' text-body-4'
          }
        >
          {day}

          {votes > 0 && rank !== null && rank <= 3 && !focusedParticipant && (
            <div className='absolute -top-3 -right-2 z-10'>
              <Badge
                variant={rank === 1 ? 'rank1' : rank === 2 ? 'rank2' : 'rank3'}
                size='sm'
                className='h-5 min-w-5 justify-center py-0 text-[10px] shadow-sm'
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
      onCloseDetail={() => setRawSelectedDate(null)}
      selectedStat={selectedStat}
      calendarRef={calendarRef}
    >
      <div className='react-datepicker-custom-wrapper flex w-full justify-center'>
        <DatePicker
          locale={ko}
          inline
          minDate={minDate}
          maxDate={maxDate}
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className='flex items-center justify-center gap-1.5 p-4'>
              <button
                onClick={() => {
                  trackEvent('voter_month_move_btn_click');
                  decreaseMonth();
                }}
                disabled={prevMonthButtonDisabled}
                type='button'
                className='flex items-center justify-center text-slate-400 transition-colors hover:text-slate-400 disabled:opacity-30'
              >
                <Icon name='arrow_prev' size={24} />
              </button>
              <span className='text-title-6 text-slate-800'>
                {format(date, 'M월')}
              </span>
              <button
                onClick={() => {
                  trackEvent('voter_month_move_btn_click');
                  increaseMonth();
                }}
                disabled={nextMonthButtonDisabled}
                type='button'
                className='flex items-center justify-center text-slate-400 transition-colors hover:text-slate-400 disabled:opacity-30'
              >
                <Icon name='arrow_next' size={24} />
              </button>
            </div>
          )}
          renderDayContents={renderDayContents}
          onChange={handleDateClick}
          selected={selectedDate ? parseDate(selectedDate) : null}
          calendarClassName='!border-none !shadow-none !font-sans'
          dayClassName={() => 'bg-transparent'}
        />
      </div>
    </VoteResultsShell>
  );
}
