import 'react-datepicker/dist/react-datepicker.css';

import { isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

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

  // State for Drag-to-Select
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    start: Date | null;
    end: Date | null;
  }>({
    isDragging: false,
    start: null,
    end: null,
  });

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

    // Reset
    setDragState({
      isDragging: false,
      start: null,
      end: null,
    });
  };

  // Determine class for each day
  const getDayClass = (date: Date) => {
    // 1. Check if selected (persisted)
    const isSelected = selectedDates.some((d) => isSameDay(d, date));

    // 2. Check if in valid drag range (visual only)
    let isInDragRange = false;
    if (dragState.isDragging && dragState.start && dragState.end) {
      const [start, end] =
        dragState.start < dragState.end
          ? [dragState.start, dragState.end]
          : [dragState.end, dragState.start];

      // Simple range check
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
      onMouseLeave={handleMouseUp} // Auto-commit if leaving container
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
        
        /* 1. COMMITTED SELECTION (Dark Blue) */
        .custom-selected-day {
            background-color: #2563EB !important;
            color: white !important;
        }
        .custom-selected-day:hover {
            background-color: #1D4ED8 !important;
        }

        /* 2. DRAG VISUALIZATION (Light Blue layer) */
        .custom-selecting-range {
             background-color: #DBEAFE !important; /* Blue-100 */
             color: #1E3A8A !important;
             border-radius: 8px !important;
        }
        
        /* Start/End of drag could be styled if we checked for equality, 
           but simple unification is often cleaner for "add" mode */

        /* If both selected AND dragging over it? 
           Usually "selected" wins color-wise, 
           but maybe we want to show it's being toggled off?
           For now let's simple cascade: .custom-selecting-range is later, 
           so it might override. Let's make sure selected wins if we want.
           Actually, the user wants "toggle".
           Visualizing "will be removed" is complex. 
           Let's stick to "Blue-100" overlay for drag range. 
        */

        /* Disabled */
        .react-datepicker__day--disabled {
            color: #d1d5db !important;
            cursor: not-allowed;
            background: transparent !important;
        }
        
        /* Hover */
        .react-datepicker__day:not(.react-datepicker__day--disabled):hover {
            background-color: #F3F4F6;
        }
        
        /* Clear default selected class behavior if any remains */
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
        onChange={() => {}} // Controlled manually via mouse events
        inline
        minDate={minDate}
        maxDate={maxDate}
        dayClassName={getDayClass}
        filterDate={(date) => !isDateDisabled(date)}
        dateFormat='yyyy. MM'
        renderDayContents={(day, date) => {
          return (
            <div
              className='flex h-full w-full items-center justify-center'
              onMouseDown={(e) => {
                e.stopPropagation(); // Prevent DatePicker's default click
                handleMouseDown(date);
              }}
              onMouseEnter={() => handleMouseEnter(date)}
            >
              {day}
            </div>
          );
        }}
      />
    </div>
  );
}
