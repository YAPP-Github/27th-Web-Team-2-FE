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

  // 각 날짜의 클래스 결정
  const getDayClass = (date: Date) => {
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

    const classes = [];
    if (isSelected) classes.push('custom-selected-day');
    if (isInDragRange) classes.push('custom-selecting-range');

    return classes.join(' ');
  };

  return (
    <div
      className='react-datepicker-wrapper-custom flex w-full justify-center select-none'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // 컨테이너를 벗어나면 자동 커밋
    >
      <style>{`
      .react-datepicker {
            border: none;
            font-family: inherit;
            width: 100%;
        }
        .react-datepicker__header {
            background: white;
            border-bottom: none;
            padding-top: 1rem;
        }
        .react-datepicker__current-month {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #111;
        }
        .react-datepicker__day-name {
            color: #9b9b9b;
            width: 2.5rem;
            margin: 0.1rem;
        }
        .react-datepicker__day {
            width: 2.5rem;
            height: 2.5rem;
            line-height: 2.5rem;
            margin: 0.1rem;
            border-radius: 8px;
            color: #333;
            font-weight: 500;
        }
        /* 레이아웃 스타일은 globals.css로 이동됨 (유동적 레이아웃) */
        
        /* 밀림 방지를 위해 모든 날짜가 동일한 크기/테두리 구조를 갖도록 보장 */
        .react-datepicker__day {
            border: 8px solid transparent !important;
            box-sizing: border-box !important;
        }

        /* 1. 확정된 선택 (회색 배경 + 굵은 흰색 테두리) */
        .custom-selected-day {
            background-color: var(--color-gray-800) !important;
            color: white !important;
            border-color: white !important;
            border-radius: 16px !important; /* 내부 박스 형태를 위한 반지름 조정 */
        }
        .custom-selected-day:hover {
            background-color: var(--color-gray-900) !important;
        }

        /* 2. 드래그 시각화 (연한 파란색 레이어) */
        .custom-selecting-range {
             background-color: #DBEAFE !important; /* Blue-100 */
             color: #1E3A8A !important;
             border-radius: 8px !important;
        }
        
        /* 시작/종료일 스타일 처리: 동일 여부를 확인할 수도 있지만,
           단순 통합 방식이 "추가" 모드에서 더 깔끔할 수 있음 */

        /* 이미 선택된 날짜 위로 드래그할 경우?
           보통 "선택됨" 색상이 우선하지만, 토글(제거)됨을 보여주고 싶을 수 있음.
           현재는 단순히 custom-selecting-range가 나중에 선언되어 덮어쓸 수 있음.
           사용자가 원하는 것은 "토글"임.
           "제거될 것임"을 시각화하는 것은 복잡하므로 
           일단 드래그 범위에 "Blue-100" 오버레이를 유지함.
        */

        /* 비활성화됨 */
        .react-datepicker__day--disabled {
            color: #d1d5db !important;
            cursor: not-allowed;
            background: transparent !important;
        }
        
        /* 호버 상태 */
        .react-datepicker__day:not(.react-datepicker__day--disabled):hover {
            background-color: #F3F4F6;
        }
        
        /* 기본 선택 클래스 동작 초기화 */
        .react-datepicker__day--selected, 
        .react-datepicker__day--keyboard-selected {
            background-color: transparent;
            color: inherit;
        }
        
        .react-datepicker-wrapper-custom .react-datepicker__month-container {
            width: 100%;
        }
      `}</style>
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
          return (
            <div
              className='flex h-full w-full items-center justify-center'
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
              {day}
            </div>
          );
        }}
      />
    </div>
  );
}
