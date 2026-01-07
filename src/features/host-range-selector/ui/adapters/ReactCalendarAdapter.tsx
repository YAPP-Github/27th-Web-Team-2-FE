import 'react-calendar/dist/Calendar.css';

import { format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import Calendar from 'react-calendar';

import {
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

  const handleDayClick = (value: Date) => {
    // Treat click as a single-date range toggle
    // Smart Toggle: If selected -> Remove, If not -> Add.
    const newSelection = toggleDatesSmart(selectedDates, [value]);
    onChange(newSelection);
  };

  const formatMonthYear = (locale: string | undefined, date: Date) => {
    return format(date, 'yyyy. MM');
  };

  return (
    <div className='flex w-full justify-center'>
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
          padding: 0;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          border-radius: 8px;
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
        
        .tile-selected {
          background: #3B82F6 !important;
          color: white !important;
        }
        
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #e6efff;
        }
      `}</style>
      <Calendar
        locale='ko-KR'
        minDate={minDate}
        maxDate={maxDate}
        tileDisabled={({ date }) => isDateDisabled(date)}
        tileClassName={({ date }) => {
          const isSelected = selectedDates.some((d) => isSameDay(d, date));
          return isSelected ? 'tile-selected' : '';
        }}
        onClickDay={handleDayClick}
        selectRange={false}
        navigationLabel={({ date }) => formatMonthYear(undefined, date)}
        next2Label={null}
        prev2Label={null}
        nextLabel={<ChevronRight />}
        prevLabel={<ChevronLeft />}
        formatDay={(locale, date) => format(date, 'd')}
      />
    </div>
  );
}
