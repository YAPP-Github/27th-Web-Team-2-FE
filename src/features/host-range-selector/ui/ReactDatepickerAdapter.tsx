import 'react-datepicker/dist/react-datepicker.css';

import { endOfMonth, format, isSameDay, startOfMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';

import Icon from '@/shared/ui/icon/Icon';
import Tooltip from '@/shared/ui/tooltip/Tooltip';

import {
  generateDateRange,
  getNavigationLimits,
  isDateDisabled,
  toggleDatesSmart,
} from '../lib/dateUtils';
import { HostRangeSelectorProps } from '../model/types';

interface ReactDatepickerAdapterProps extends HostRangeSelectorProps {
  showNextMonthTooltip?: boolean;
}

export function ReactDatepickerAdapter({
  selectedDates,
  onChange,
  availableDates,
  showNextMonthTooltip = false,
}: ReactDatepickerAdapterProps) {
  const { minDate: defaultMin, maxDate: defaultMax } = getNavigationLimits();

  // availableDates가 있으면 그 범위를 최우선으로 적용
  const navigationLimits = React.useMemo(() => {
    if (!availableDates || availableDates.length === 0) {
      return { minDate: defaultMin, maxDate: defaultMax };
    }

    // availableDates가 정렬되어 있다고 가정하거나, 직접 정렬
    const sortedDates = [...availableDates].sort(
      (a, b) => a.getTime() - b.getTime(),
    );
    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];

    // minDate: 첫 번째 가능 날짜의 월의 1일
    // maxDate: 마지막 가능 날짜의 월의 마지막 날
    return {
      minDate: startOfMonth(firstDate),
      maxDate: endOfMonth(lastDate),
    };
  }, [availableDates, defaultMin, defaultMax]);

  const { minDate, maxDate } = navigationLimits;

  const dragRef = useRef<{
    isDragging: boolean;
    start: Date | null;
    end: Date | null;
  }>({
    isDragging: false,
    start: null,
    end: null,
  });

  const touchHandledRef = useRef(false);

  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    start: Date | null;
    end: Date | null;
  }>({
    isDragging: false,
    start: null,
    end: null,
  });

  const [isTooltipVisible, setIsTooltipVisible] =
    useState(showNextMonthTooltip);

  useEffect(() => {
    if (!showNextMonthTooltip) return;

    // 초기 진입 시 툴팁을 띄우고 3초 뒤에 사라지게 합니다.
    // useState(showNextMonthTooltip)으로 초기값을 잡았으므로,
    // 여기서 setIsTooltipVisible(true)를 다시 호출할 필요가 없습니다.

    const timer = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showNextMonthTooltip]);

  const isDateAllowed = (date: Date) => {
    // 1. 기본 비활성화 (오늘 이전)
    if (isDateDisabled(date)) return false;

    // 2. 가능 날짜 목록이 있으면, 그 안에 포함되어야 함
    if (availableDates && availableDates.length > 0) {
      return availableDates.some((d) => isSameDay(d, date));
    }

    return true;
  };

  const handleTouchStart = (e: React.TouchEvent, date: Date) => {
    touchHandledRef.current = true;
    if (!isDateAllowed(date)) return;
    dragRef.current = { isDragging: true, start: date, end: date };
    setDragState({ isDragging: true, start: date, end: date });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const { isDragging, start, end } = dragRef.current;
    if (!isDragging || !start) return;

    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    const cell = target?.closest('[data-date-timestamp]');
    if (cell) {
      const ts = cell.getAttribute('data-date-timestamp');
      if (ts) {
        const hoveredDate = new Date(parseInt(ts, 10));

        if (end && !isSameDay(hoveredDate, end) && isDateAllowed(hoveredDate)) {
          dragRef.current.end = hoveredDate;
          setDragState((prev) => ({ ...prev, end: hoveredDate }));
        }
      }
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp(true); // fromTouch = true
    // 터치 후 발생하는 마우스 이벤트를 무시하기 위해 짧은 딜레이 후 리셋
    setTimeout(() => {
      touchHandledRef.current = false;
    }, 300);
  };

  const handleMouseDown = (date: Date) => {
    if (touchHandledRef.current) return; // 터치 이벤트 후 발생한 마우스 이벤트 무시
    if (!isDateAllowed(date)) return;
    dragRef.current = { isDragging: true, start: date, end: date };
    setDragState({ isDragging: true, start: date, end: date });
  };

  const handleMouseEnter = (date: Date) => {
    const { isDragging, start } = dragRef.current;
    if (!isDragging || !start || !isDateAllowed(date)) {
      return;
    }

    dragRef.current.end = date;
    setDragState((prev) => ({ ...prev, end: date }));
  };

  const handleMouseUp = (fromTouch = false) => {
    // 터치가 아닌 마우스 이벤트인데 터치가 처리된 상태면 무시
    if (!fromTouch && touchHandledRef.current) {
      return;
    }

    const { isDragging, start, end } = dragRef.current;
    if (!isDragging || !start || !end) {
      return;
    }

    dragRef.current = { isDragging: false, start: null, end: null };

    const newRange = generateDateRange(start, end);
    const newSelection = toggleDatesSmart(selectedDates, newRange);
    onChange(newSelection);

    setDragState({ isDragging: false, start: null, end: null });
  };

  const getDayClass = () => 'bg-transparent';

  return (
    <div
      className='react-datepicker-wrapper-custom flex w-full justify-center select-none'
      onMouseUp={() => handleMouseUp(false)}
      onMouseLeave={() => handleMouseUp(false)}
    >
      <DatePicker
        locale={ko}
        onChange={() => {}}
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
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              type='button'
              className='flex items-center justify-center text-slate-400 transition-colors hover:text-slate-400 disabled:opacity-30'
            >
              <Icon name='arrow_prev' size={24} />
            </button>
            <span className='text-title-6 text-slate-800'>
              {format(date, 'M월')}
            </span>
            {showNextMonthTooltip && !nextMonthButtonDisabled ? (
              <Tooltip
                message='다음 달도 투표할 수 있어요'
                visible={isTooltipVisible}
                className='z-50'
                triggerOnHover={false}
              >
                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  type='button'
                  className='flex items-center justify-center text-slate-400 transition-colors hover:text-slate-400 disabled:opacity-30'
                >
                  <Icon name='arrow_next' size={24} />
                </button>
              </Tooltip>
            ) : (
              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                type='button'
                className='flex items-center justify-center text-slate-400 transition-colors hover:text-slate-400 disabled:opacity-30'
              >
                <Icon name='arrow_next' size={24} />
              </button>
            )}
          </div>
        )}
        dayClassName={getDayClass}
        filterDate={(date) => isDateAllowed(date)}
        dateFormat='yyyy. MM'
        renderDayContents={(day, date) => {
          if (!date) return <span>{day}</span>;

          const disabled = !isDateAllowed(date);

          const isSelected = selectedDates.some((d) => isSameDay(d, date));

          let isInDragRange = false;
          if (dragState.isDragging && dragState.start && dragState.end) {
            const [start, end] =
              dragState.start < dragState.end
                ? [dragState.start, dragState.end]
                : [dragState.end, dragState.start];

            if (date >= start && date <= end && !disabled) {
              isInDragRange = true;
            }
          }

          let bgClass = '';
          let textClass = 'text-slate-900';

          if (disabled) {
            bgClass = '';
            textClass = 'text-slate-300';
          } else if (isSelected) {
            bgClass = 'bg-gray-800';
            textClass = 'text-white';
          } else if (isInDragRange) {
            bgClass = 'bg-slate-100';
            textClass = 'text-slate-900';
          } else {
            bgClass = 'hover:bg-slate-100';
          }

          return (
            <div
              className={`flex h-full w-full items-center justify-center py-1 ${disabled ? 'pointer-events-none' : 'cursor-pointer'}`}
              onMouseDown={(e) => {
                if (disabled) return;
                e.stopPropagation();
                handleMouseDown(date);
              }}
              onMouseEnter={() => !disabled && handleMouseEnter(date)}
              data-date-timestamp={date.getTime()}
              onTouchStart={(e) => !disabled && handleTouchStart(e, date)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: 'none' }}
            >
              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${bgClass} ${textClass} text-body-4`}
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
