'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';

import { VoteResultsProps } from '@/entities/voteDateStat/model';
import { calculateRank, isDateDisabled, parseDate } from '@/shared/lib/date';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/Badge';
import Icon from '@/shared/ui/icon/Icon';

import { VoteResultsShell } from '../VoteResultsShell';

export function ReactDatePickerVoteResultsCalendar({
  openRange,
  stats,
  focusedParticipant,
}: VoteResultsProps & { focusedParticipant?: string | null }) {
  const [rawSelectedDate, setRawSelectedDate] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // 문자열 날짜를 라이브러리용 Date 객체로 변환
  const minDate = parseDate(openRange.start);
  const maxDate = parseDate(openRange.end);

  // [Derived State] 필터링 조건에 따라 유효한 선택 날짜를 렌더링 중에 계산합니다.
  // 필터(참여자)가 변경되어도 원본 상태(rawSelectedDate)는 유지되므로, 필터 해제 시 복구됩니다.
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

    // 후보 날짜인지 확인합니다. (통계에 존재하는지 여부)
    // 통계에 없다면 후보 날짜가 아니므로 무시합니다.
    if (!stat) return;

    // 만약 필터링 중이라면, 해당 참여자가 가능한 날짜만 클릭 가능하도록 함
    if (focusedParticipant) {
      const isParticipantPossible = stat.can.some(
        (p) => p.name === focusedParticipant,
      );
      if (!isParticipantPossible) return;
    }

    if (selectedDate === dateStr) {
      setRawSelectedDate(null); // 토글 해제
    } else {
      setRawSelectedDate(dateStr);
    }
  };

  const renderDayContents = (day: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');

    // 스타일링을 위한 간단한 비활성화 체크 (범위)
    // const disabled = isDateDisabled(dateStr, openRange);

    const stat = stats.find((s) => s.date === dateStr);
    const votes = stat ? stat.can.length : 0;
    const isCandidate = !!stat;

    // 랭킹 로직
    const simpleStats = stats.map((s) => ({
      date: s.date,
      count: s.can.length,
    }));
    const rank = calculateRank(simpleStats, dateStr);

    const isSelected = selectedDate === dateStr;

    // 색상 로직
    let bgClass = '';
    let textClass = 'text-slate-900';

    // 필터링 적용 여부
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
        // 필터링 된 경우: 배경 없음, 검은 텍스트 (비활성 느낌이지만 글씨는 보임)
        bgClass = '';
        textClass = 'text-slate-900';
      } else {
        // 이번 모임의 유효한 후보 날짜입니다.
        if (votes > 0) {
          if (focusedParticipant) {
            // 필터링 적용 시: Gray 800
            bgClass = 'bg-gray-800';
            textClass = 'text-white font-bold';
          } else if (rank && rank <= 3) {
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
      }
    } else {
      // 후보 날짜 아님: 비활성화/회색
      textClass = 'text-slate-300';
    }

    // 선택 상태: 링 추가
    const selectedClass = isSelected
      ? 'ring-2 ring-blue-100 ring-offset-2'
      : '';

    // 상호작용: 후보 날짜만 클릭 가능, 필터링 된 날짜는 클릭 불가
    const isInteractive =
      isCandidate && !isDateDisabled(dateStr, openRange) && !isFilteredOut;

    return (
      <div className='flex h-full w-full items-center justify-center py-1'>
        <div
          className={cn(
            'relative flex h-9 w-9 items-center justify-center rounded-lg text-base font-normal transition-colors sm:h-10 sm:w-10', // 반응형 사이즈 1:1
            bgClass,
            textClass,
            selectedClass,
            isInteractive && !isSelected && 'hover:brightness-95',
            !isInteractive && 'pointer-events-none text-slate-300',
            isFilteredOut && 'text-slate-900', // 필터링 된 경우 텍스트 색상 강제 지정
            isInteractive && 'pointer-events-auto cursor-pointer',
          )}
        >
          {day}

          {/* 랭킹 뱃지 - 우측 상단 */}
          {votes > 0 && rank !== null && rank <= 3 && !focusedParticipant && (
            <div className='absolute -top-3 -right-2 z-10'>
              <Badge
                variant={rank === 1 ? 'rank1' : rank === 2 ? 'rank2' : 'rank3'}
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
  };

  // 요일 이름을 '일', '월' 형태로 강제하기 위한 커스텀 로케일

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
            <div className='mb-4 flex items-center justify-center gap-9'>
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                type='button'
                className='flex items-center justify-center text-slate-400 transition-colors hover:text-slate-400 disabled:opacity-30'
              >
                <Icon name='arrow_prev' size={24} />
              </button>
              <span className='text-xl font-bold text-slate-800'>
                {format(date, 'M월')}
              </span>
              <button
                onClick={increaseMonth}
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
          dayClassName={() => 'bg-transparent'} // 기본 스타일 초기화
        />
      </div>
    </VoteResultsShell>
  );
}
