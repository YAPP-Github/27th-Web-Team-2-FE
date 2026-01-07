'use client';

import 'react-calendar/dist/Calendar.css';

import { endOfMonth, format, setMonth } from 'date-fns';
import React, { useState } from 'react';
import Calendar from 'react-calendar';

import { parseDate } from '@/shared/lib/date';

import { HostRangeProps } from '../../model/types';
import { HostRangeShell } from '../HostRangeShell';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export function ReactCalendarHostRangeSelector({
  today,
  initial,
  onChange,
}: HostRangeProps) {
  const [value, setValue] = useState<Value>(
    initial?.start && initial?.end
      ? [parseDate(initial.start), parseDate(initial.end)]
      : null,
  );

  const todayDate = parseDate(today);
  const currentYear = todayDate.getFullYear();
  const maxLimit = endOfMonth(setMonth(new Date(currentYear + 1, 0, 1), 1));

  const handleChange = (nextValue: Value) => {
    setValue(nextValue);

    if (Array.isArray(nextValue) && nextValue[0] && nextValue[1]) {
      onChange({
        start: format(nextValue[0], 'yyyy-MM-dd'),
        end: format(nextValue[1], 'yyyy-MM-dd'),
      });
    } else {
      onChange({});
    }
  };

  const getRange = () => {
    if (Array.isArray(value) && value[0] && value[1]) {
      return {
        start: format(value[0], 'yyyy-MM-dd'),
        end: format(value[1], 'yyyy-MM-dd'),
      };
    }
    return {};
  };

  return (
    <HostRangeShell
      range={getRange()}
      onConfirm={() => {}}
      onChangeVoteType={() => {}}
    >
      <div className='react-calendar-range-wrapper'>
        <Calendar
          locale='ko-KR'
          calendarType='gregory'
          formatDay={(locale, date) => format(date, 'd')}
          selectRange={true} // Enable Range
          value={value}
          onChange={handleChange}
          minDate={todayDate}
          maxDate={maxLimit}
          next2Label={null}
          prev2Label={null}
        />
      </div>
    </HostRangeShell>
  );
}
