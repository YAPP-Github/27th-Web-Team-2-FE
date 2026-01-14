import 'react-datepicker/dist/react-datepicker.css';

import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import Icon from '@/shared/ui/icon/Icon';

import {
  generateDateRange,
  getNavigationLimits,
  isDateDisabled,
  toggleDatesSmart,
} from '../../lib/dateUtils';
import { HostRangeSelectorProps } from '../../model/types';

export function ReactDatepickerAdapter({
  selectedDates,
  onChange,
}: HostRangeSelectorProps) {
  const { minDate, maxDate } = getNavigationLimits();

  // 드래그 선택을 위한 상태
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    start: Date | null;
    end: Date | null;
  }>({
    isDragging: false,
    start: null,
    end: null,
  });

  /* 터치 이벤트 핸들러 */
  const handleTouchStart = (e: React.TouchEvent, date: Date) => {
    // 날짜 타일에서의 스크롤 상호작용 방지
    // 참고: e.preventDefault()는 ref에 설정되지 않은 경우 일부 브라우저에서
    // "passive listener" 경고를 유발할 수 있음.
    // 하지만 CSS의 touch-action: none이 이를 처리하는 현대적인 방법임.

    if (isDateDisabled(date)) return;
    setDragState({
      isDragging: true,
      start: date,
      end: date,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragState.isDragging || !dragState.start) return;

    // 터치한 위치의 요소 찾기
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    // data 속성을 가진 가장 가까운 날짜 셀 찾기
    const cell = target?.closest('[data-date-timestamp]');
    if (cell) {
      const ts = cell.getAttribute('data-date-timestamp');
      if (ts) {
        const hoveredDate = new Date(parseInt(ts, 10));

        // 종료 날짜가 다르면 업데이트
        if (dragState.end && !isSameDay(hoveredDate, dragState.end)) {
          setDragState((prev) => ({
            ...prev,
            end: hoveredDate,
          }));
        }
      }
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp(); // 로직 동일
  };

  const handleMouseDown = (date: Date) => {
    if (isDateDisabled(date)) return;
    setDragState({
      isDragging: true,
      start: date,
      end: date,
    });
  };

  const handleMouseEnter = (date: Date) => {
    if (!dragState.isDragging || !dragState.start) return;
    setDragState((prev) => ({
      ...prev,
      end: date,
    }));
  };

  const handleMouseUp = () => {
    if (dragState.isDragging && dragState.start && dragState.end) {
      const newRange = generateDateRange(dragState.start, dragState.end);
      const newSelection = toggleDatesSmart(selectedDates, newRange);
      onChange(newSelection);
    }

    // 초기화
    setDragState({
      isDragging: false,
      start: null,
      end: null,
    });
  };

  // 각 날짜의 클래스 결정 (이제 투명하게 처리)
  const getDayClass = () => 'bg-transparent';

  return (
    <div
      className='react-datepicker-wrapper-custom flex w-full justify-center select-none'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // 컨테이너를 벗어나면 자동 커밋
    >
      <DatePicker
        locale={ko}
        onChange={() => {}} // 마우스 이벤트를 통해 수동 제어
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
        dayClassName={getDayClass}
        filterDate={(date) => !isDateDisabled(date)}
        dateFormat='yyyy. MM'
        renderDayContents={(day, date) => {
          // 1. 선택된 날짜인지 확인 (저장된 상태)
          const isSelected = selectedDates.some((d) => isSameDay(d, date));

          // 2. 유효한 드래그 범위 내인지 확인 (시각적 표시)
          let isInDragRange = false;
          if (dragState.isDragging && dragState.start && dragState.end) {
            const [start, end] =
              dragState.start < dragState.end
                ? [dragState.start, dragState.end]
                : [dragState.end, dragState.start];

            // 단순 범위 확인
            if (date >= start && date <= end && !isDateDisabled(date)) {
              isInDragRange = true;
            }
          }

          let bgClass = '';
          let textClass = 'text-slate-900';

          if (isSelected) {
            bgClass = 'bg-gray-800';
            textClass = 'text-white font-bold';
          } else if (isInDragRange) {
            bgClass = 'bg-blue-100';
            textClass = 'text-slate-900';
          } else {
            bgClass = 'hover:bg-slate-100';
          }

          return (
            <div
              className='flex h-full w-full items-center justify-center py-1'
              // 마우스 핸들러
              onMouseDown={(e) => {
                e.stopPropagation(); // DatePicker의 기본 클릭 방지
                handleMouseDown(date);
              }}
              onMouseEnter={() => handleMouseEnter(date)}
              // 터치 핸들러
              data-date-timestamp={date.getTime()} // elementFromPoint 식별을 위한 셀 데이터
              onTouchStart={(e) => handleTouchStart(e, date)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              // 모바일에서 드래그 중 스크롤 방지
              style={{ touchAction: 'none' }}
            >
              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-lg text-base font-normal transition-colors ${bgClass} ${textClass} `}
              >
                {day}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
