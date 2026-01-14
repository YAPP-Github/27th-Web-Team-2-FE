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

    // 후보 날짜인지 확인합니다. (통계에 존재하는지 여부)
    // 통계에 없다면 후보 날짜가 아니므로 무시합니다.
    if (!stat) return;

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
          formatDay={() => ''} // 겹침 방지를 위해 기본 날짜 숨김
          tileContent={({ date, view }) => {
            if (view !== 'month') return null;
            const dateStr = format(date, 'yyyy-MM-dd');
            const stat = stats.find((s) => s.date === dateStr);
            const votes = stat ? stat.can.length : 0;
            const isSelected = selectedDate === dateStr;
            // const disabled = isDateDisabled(dateStr, openRange);

            // 모든 날짜에 대해 기본 props 재계산
            const dayNumber = format(date, 'd');

            // Simple disable check for styling
            // const isDisabledOrNoVotes = disabled || votes === 0;

            // 랭킹 로직
            const simpleStats = stats.map((s) => ({
              date: s.date,
              count: s.can.length,
            }));
            const rank = calculateRank(simpleStats, dateStr);

            // 색상 로직
            let bgClass = '';
            let textClass = 'text-slate-900';

            // 후보 날짜 여부 확인 (statistics 존재 여부)
            const isCandidate = !!stat;

            if (isCandidate) {
              // 이번 모임의 유효한 후보 날짜입니다.
              if (votes > 0) {
                if (rank && rank <= 3) {
                  // 1~3위: 완전 파란색 (blue-100), 글자 흰색
                  bgClass = 'bg-blue-100 shadow-sm';
                  textClass = 'text-white font-bold';
                } else {
                  // 그 외 투표: 하늘색 (blue-30), 글자 파란색
                  bgClass = 'bg-blue-30';
                  textClass = 'text-blue-100 font-medium';
                }
              } else {
                // 0표지만 후보 날짜인 경우: 일반 검정 텍스트
                bgClass = 'hover:bg-slate-100'; // 호버 효과 추가
                textClass = 'text-slate-900';
              }
            } else {
              // 후보 날짜 아님: 비활성화/회색
              textClass = 'text-slate-300';
            }

            // 선택 상태: 링 추가
            const selectedClass = isSelected
              ? 'ring-2 ring-blue-100 ring-offset-2'
              : '';

            // 상호작용: 후보 날짜만 클릭 가능
            const isInteractive =
              isCandidate && !isDateDisabled(dateStr, openRange);

            return (
              <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                <div
                  className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-lg text-base transition-colors sm:h-10 sm:w-10', // 반응형 사이즈
                    bgClass,
                    textClass,
                    selectedClass,
                    isInteractive && !isSelected && 'hover:brightness-95',
                    !isInteractive && 'pointer-events-none text-slate-300', // 후보 날짜가 아닌 경우 덮어쓰기
                    isInteractive && 'pointer-events-auto cursor-pointer',
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
                        className='h-5 min-w-5 justify-center px-1 py-0 text-[10px] shadow-sm'
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

            // 항상 타일에 대해 상대적이고 기본적인 레이아웃 제공
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
