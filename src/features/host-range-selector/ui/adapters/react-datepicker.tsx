'use client';

import 'react-datepicker/dist/react-datepicker.css';

import { endOfMonth, format, setMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import { parseDate } from '@/shared/lib/date';

import { HostRangeProps } from '../../model/types';
import { HostRangeShell } from '../HostRangeShell';

export function ReactDatePickerHostRangeSelector({
  today,
  initial,
  onChange,
}: HostRangeProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    initial?.start ? parseDate(initial.start) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initial?.end ? parseDate(initial.end) : undefined,
  );

  // Logic: Max date is Next Year Feb
  const todayDate = parseDate(today);
  const currentYear = todayDate.getFullYear();
  // Next year Feb = (Current Year + 1)-02-XX
  const maxLimit = endOfMonth(setMonth(new Date(currentYear + 1, 0, 1), 1)); // Feb is index 1

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start || undefined);
    setEndDate(end || undefined);

    onChange({
      start: start ? format(start, 'yyyy-MM-dd') : undefined,
      end: end ? format(end, 'yyyy-MM-dd') : undefined,
    });
  };

  return (
    <HostRangeShell
      range={{
        start: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        end: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      }}
      onConfirm={() => {}}
      onChangeVoteType={() => {}}
    >
      <div className='react-datepicker-range-wrapper'>
        <DatePicker
          selected={startDate}
          onChange={handleChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          locale={ko}
          minDate={todayDate}
          maxDate={maxLimit}
          calendarClassName='!border-none !shadow-none !font-sans'
          dayClassName={(date) => {
            // Custom styling for range
            // The library handles 'react-datepicker__day--in-range' etc basic classes
            // But we can add overrides if needed
            return 'cursor-pointer rounded-none mx-0 w-8 h-8 flex items-center justify-center';
          }}
        />
      </div>
    </HostRangeShell>
  );
}
