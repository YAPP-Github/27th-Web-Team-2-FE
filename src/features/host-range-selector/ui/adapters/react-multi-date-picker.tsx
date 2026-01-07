'use client';

// Default theme is used
import { endOfMonth, setMonth } from 'date-fns';
import React, { useState } from 'react';
import Calendar, { DateObject } from 'react-multi-date-picker';

import { parseDate } from '@/shared/lib/date';

import { HostRangeProps } from '../../model/types';
import { HostRangeShell } from '../HostRangeShell';

export function MultiDatePickerHostRangeSelector({
  today,
  initial,
  onChange,
}: HostRangeProps) {
  const [value, setValue] = useState<DateObject[] | null>(
    initial?.start && initial?.end
      ? [new DateObject(initial.start), new DateObject(initial.end)]
      : null,
  );

  const todayDate = parseDate(today);
  const currentYear = todayDate.getFullYear();
  const maxLimit = endOfMonth(setMonth(new Date(currentYear + 1, 0, 1), 1));

  const handleChange = (dateObjects: DateObject[]) => {
    setValue(dateObjects);

    if (dateObjects.length === 2) {
      // Multi Date Picker sorts them usually?
      const sorted = dateObjects.sort((a, b) => a.toUnix() - b.toUnix());
      onChange({
        start: sorted[0].format('YYYY-MM-DD'),
        end: sorted[1].format('YYYY-MM-DD'),
      });
    } else {
      onChange({});
    }
  };

  const getRange = () => {
    if (Array.isArray(value) && value.length === 2) {
      const sorted = [...value].sort((a, b) => a.toUnix() - b.toUnix());
      return {
        start: sorted[0].format('YYYY-MM-DD'),
        end: sorted[1].format('YYYY-MM-DD'),
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
      <div className='multi-datepicker-range-wrapper'>
        <Calendar
          range
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={value as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={handleChange as any}
          minDate={todayDate}
          maxDate={maxLimit}
          shadow={false}
          className='custom-calendar-rmdp'
        />
      </div>
    </HostRangeShell>
  );
}
