import 'react-datepicker/dist/react-datepicker.css';

import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';

import Icon from '@/shared/ui/icon/Icon';

import {
  generateDateRange,
  getNavigationLimits,
  isDateDisabled,
  toggleDatesSmart,
} from '../lib/dateUtils';
import { HostRangeSelectorProps } from '../model/types';

export function ReactDatepickerAdapter({
  selectedDates,
  onChange,
}: HostRangeSelectorProps) {
  const { minDate, maxDate } = getNavigationLimits();

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

  const handleTouchStart = (e: React.TouchEvent, date: Date) => {
    touchHandledRef.current = true;
    if (isDateDisabled(date)) return;
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

        if (
          end &&
          !isSameDay(hoveredDate, end) &&
          !isDateDisabled(hoveredDate)
        ) {
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
    if (isDateDisabled(date)) return;
    dragRef.current = { isDragging: true, start: date, end: date };
    setDragState({ isDragging: true, start: date, end: date });
  };

  const handleMouseEnter = (date: Date) => {
    const { isDragging, start } = dragRef.current;
    if (!isDragging || !start || isDateDisabled(date)) {
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
          if (!date) return <span>{day}</span>;

          const disabled = isDateDisabled(date);

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
          let selectedClass = '';

          if (disabled) {
            bgClass = '';
            textClass = 'text-slate-300';
          } else if (isSelected) {
            bgClass = 'bg-gray-800';
            textClass = 'text-white font-bold';
            selectedClass = 'ring-2 ring-blue-100 ring-offset-2';
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
                className={`relative flex h-10 w-10 items-center justify-center rounded-lg text-base font-normal transition-colors ${bgClass} ${textClass} ${selectedClass}`}
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
