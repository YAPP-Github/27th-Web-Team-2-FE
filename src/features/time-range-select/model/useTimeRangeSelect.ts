'use client';

import { useMemo, useState } from 'react';

import {
  generateTimeSlots,
  getEndTimeOptions,
  isValidTimeRange,
  timeToMinutes,
} from '../lib/timeUtils';
import type { TimeOption, TimeValue } from './types';

interface UseTimeRangeSelectOptions {
  initialStartTime?: TimeValue;
  initialEndTime?: TimeValue;
  onChange?: (range: { startTime: TimeValue; endTime: TimeValue }) => void;
}

interface UseTimeRangeSelectReturn {
  startTime: TimeValue | null;
  endTime: TimeValue | null;
  isComplete: boolean;
  isValid: boolean;
  handleStartTimeChange: (value: TimeValue) => void;
  handleEndTimeChange: (value: TimeValue) => void;
  endTimeOptions: TimeOption[];
  allSlots: TimeValue[];
}

export function useTimeRangeSelect({
  initialStartTime,
  initialEndTime,
  onChange,
}: UseTimeRangeSelectOptions = {}): UseTimeRangeSelectReturn {
  const [startTime, setStartTime] = useState<TimeValue | null>(
    initialStartTime ?? null,
  );
  const [endTime, setEndTime] = useState<TimeValue | null>(
    initialEndTime ?? null,
  );

  const allSlots = useMemo(() => generateTimeSlots(), []);

  const endTimeOptions = useMemo(
    () =>
      startTime
        ? getEndTimeOptions(startTime, allSlots)
        : allSlots.map((slot) => ({
            value: slot,
            label: `${String(slot.hour).padStart(2, '0')}:${String(slot.minute).padStart(2, '0')}`,
            isDisabled: false,
          })),
    [startTime, allSlots],
  );

  const isComplete = startTime !== null && endTime !== null;
  const isValid =
    isComplete &&
    isValidTimeRange(startTime as TimeValue, endTime as TimeValue);

  function handleStartTimeChange(value: TimeValue) {
    setStartTime(value);
    // 기존 endTime이 새 startTime 이하이면 초기화
    if (endTime !== null && timeToMinutes(endTime) <= timeToMinutes(value)) {
      setEndTime(null);
    }
  }

  function handleEndTimeChange(value: TimeValue) {
    if (startTime !== null && !isValidTimeRange(startTime, value)) return;
    setEndTime(value);
    if (startTime !== null) {
      onChange?.({ startTime, endTime: value });
    }
  }

  return {
    startTime,
    endTime,
    isComplete,
    isValid,
    handleStartTimeChange,
    handleEndTimeChange,
    endTimeOptions,
    allSlots,
  };
}
