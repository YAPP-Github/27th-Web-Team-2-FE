import 'react-calendar/dist/Calendar.css';

import { format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import Calendar from 'react-calendar';

import {
  generateDateRange,
  getNavigationLimits,
  isDateDisabled,
  toggleDatesSmart,
} from '../../lib/dateUtils';
import { HostRangeSelectorProps } from '../../model/types';

export function ReactCalendarAdapter({
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
    // Remove focus from the tile to prevent persistent hover/focus state
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

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

  /* Touch Handlers */
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
    handleMouseUp();
  };

  const formatMonthYear = (locale: string | undefined, date: Date) => {
    return format(date, 'yyyy. MM');
  };

  return (
    <div
      className='flex w-full justify-center select-none'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <style>{`
        .react-calendar {
          border: none;
          width: 100%;
          font-family: inherit;
        }
        .react-calendar__navigation {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }
        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 18px;
          font-weight: 600;
        }
        .react-calendar__navigation__label {
          flex-grow: 0 !important;
        }
        .react-calendar__tile {
          padding: 0 !important; /* Remove padding to let inner div fill */
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          border-radius: 8px;
          overflow: hidden;
          position: relative; /* Critical for absolute overlay */
        }
        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 12px;
          color: #999;
          margin-bottom: 8px;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
        
        /* Reset default active/now styles to prevent conflicts */
        .react-calendar__tile--now {
          background: transparent !important;
          color: inherit !important;
        }
        .react-calendar__tile--active {
          background: transparent !important;
          color: inherit !important;
        }
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: #e6efff !important;
        }

        /* Custom State Styles - High Specificity to override active/focus */
        .react-calendar__tile.tile-selected {
          background: #3B82F6 !important;
          color: white !important;
        }
        
        /* Ensure specific text color for drag state (Light Blue bg) */
        .react-calendar__tile.tile-dragging {
          background: #DBEAFE !important;
          color: #1E3A8A !important;
        }

        /* Conflict resolution: active/focus vs custom */
        /* If tile is active but NOT selected/dragging (shouldn't happen often in this logic), use default overrides */
        .react-calendar__tile--active:not(.tile-selected):not(.tile-dragging) {
           background: transparent !important;
           color: inherit !important;
        }
        
        /* Interaction Hover: Only for non-selected items or dragging items */
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #e6efff;
        }
        
        /* If selected, hover shouldn't change it much or stay blue */
        .react-calendar__tile.tile-selected:enabled:hover,
        .react-calendar__tile.tile-selected:enabled:focus {
           background: #2563EB !important; /* Darker blue */
        }


        /* Override default disabled style if needed */
        .react-calendar__tile:disabled {
          background-color: transparent;
          color: #d1d5db !important;
        }
      `}</style>
      <Calendar
        locale='ko-KR'
        minDate={minDate}
        maxDate={maxDate}
        tileDisabled={({ date }) => isDateDisabled(date)}
        // Determine class based on state
        tileClassName={({ date }) => {
          const isSelected = selectedDates.some((d) => isSameDay(d, date));

          let isInDragRange = false;
          if (dragState.isDragging && dragState.start && dragState.end) {
            const [start, end] =
              dragState.start < dragState.end
                ? [dragState.start, dragState.end]
                : [dragState.end, dragState.start];
            if (date >= start && date <= end && !isDateDisabled(date)) {
              isInDragRange = true;
            }
          }

          const classes = [];
          if (isSelected) classes.push('tile-selected');
          if (isInDragRange) classes.push('tile-dragging');
          return classes.join(' ');
        }}
        // Handlers via tileContent
        onClickDay={() => {}} // Disable default click
        selectRange={false}
        navigationLabel={({ date }) => formatMonthYear(undefined, date)}
        next2Label={null}
        prev2Label={null}
        nextLabel={<ChevronRight />}
        prevLabel={<ChevronLeft />}
        // Hide default day number
        formatDay={() => ''}
        // Custom content is the interactive layer
        tileContent={({ date, view }) => {
          if (view !== 'month') return null;

          return (
            <div className='absolute inset-0 flex items-center justify-center'>
              <div
                className='flex h-full w-full items-center justify-center'
                // Mouse
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(date);
                }}
                onMouseEnter={() => handleMouseEnter(date)}
                // Touch
                data-date-timestamp={date.getTime()}
                onTouchStart={(e) => handleTouchStart(e, date)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: 'none' }}
              >
                {format(date, 'd')}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
