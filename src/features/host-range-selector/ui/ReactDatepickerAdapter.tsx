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
} from '../lib/dateUtils';
import { HostRangeSelectorProps } from '../model/types';

export function ReactDatepickerAdapter({
  selectedDates,
  onChange,
}: HostRangeSelectorProps) {
  const { minDate, maxDate } = getNavigationLimits();

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
    if (isDateDisabled(date)) return;
    setDragState({
      isDragging: true,
      start: date,
      end: date,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragState.isDragging || !dragState.start) return;

    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    const cell = target?.closest('[data-date-timestamp]');
    if (cell) {
      const ts = cell.getAttribute('data-date-timestamp');
      if (ts) {
        const hoveredDate = new Date(parseInt(ts, 10));

        if (
          dragState.end &&
          !isSameDay(hoveredDate, dragState.end) &&
          !isDateDisabled(hoveredDate)
        ) {
          setDragState((prev) => ({
            ...prev,
            end: hoveredDate,
          }));
        }
      }
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp();
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
    if (!dragState.isDragging || !dragState.start || isDateDisabled(date)) {
      return;
    }

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

    setDragState({
      isDragging: false,
      start: null,
      end: null,
    });
  };

  const getDayClass = () => 'bg-transparent';

  return (
    <div
      className='react-datepicker-wrapper-custom flex w-full justify-center select-none'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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

          if (disabled) {
            bgClass = '';
            textClass = 'text-slate-300';
          } else if (isSelected) {
            bgClass = 'bg-gray-800';
            textClass = 'text-white font-bold';
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
