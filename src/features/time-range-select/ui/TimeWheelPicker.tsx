'use client';

import { useMemo } from 'react';

import type { TimeValue } from '../model/types';
import TimeWheelColumn from './TimeWheelColumn';

const ITEM_HEIGHT = 56;
const CONTAINER_HEIGHT = ITEM_HEIGHT * 5; // 280px

const ALL_HOURS = Array.from({ length: 24 }, (_, i) => i);
const ALL_MINUTES = [0, 30];

interface TimeWheelPickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  /** 종료시간 피커용: value > minTime 이어야 함 */
  minTime?: TimeValue;
  /** 시작시간 피커용: value < maxTime 이어야 함 */
  maxTime?: TimeValue;
}

export default function TimeWheelPicker({
  value,
  onChange,
  minTime,
  maxTime,
}: TimeWheelPickerProps) {
  // 선택 가능한 시 목록
  const availableHours = useMemo(() => {
    if (minTime) {
      // minTime.minute == 30이면 같은 시에 유효 분이 없으므로 다음 시부터
      const startHour = minTime.minute === 30 ? minTime.hour + 1 : minTime.hour;
      return ALL_HOURS.filter((h) => h >= startHour);
    }
    if (maxTime) {
      // maxTime.minute == 0이면 같은 시에 유효 분이 없으므로 이전 시까지
      const endHour = maxTime.minute === 0 ? maxTime.hour - 1 : maxTime.hour;
      return ALL_HOURS.filter((h) => h <= endHour);
    }
    return ALL_HOURS;
  }, [minTime, maxTime]);

  // 현재 선택된 시 기준 선택 가능한 분 목록
  const availableMinutes = useMemo(() => {
    if (minTime && value.hour === minTime.hour) {
      // 같은 시: minTime.minute(== 0) 초과만 유효 → [30]
      return ALL_MINUTES.filter((m) => m > minTime.minute);
    }
    if (maxTime && value.hour === maxTime.hour) {
      // 같은 시: maxTime.minute(== 30) 미만만 유효 → [0]
      return ALL_MINUTES.filter((m) => m < maxTime.minute);
    }
    return ALL_MINUTES;
  }, [minTime, maxTime, value.hour]);

  function handleHourChange(hour: number) {
    // 시가 바뀌면 분의 유효 범위도 바뀔 수 있으므로 자동 보정
    let newMins = ALL_MINUTES;
    if (minTime && hour === minTime.hour)
      newMins = ALL_MINUTES.filter((m) => m > minTime.minute);
    if (maxTime && hour === maxTime.hour)
      newMins = ALL_MINUTES.filter((m) => m < maxTime.minute);

    const minute = newMins.includes(value.minute)
      ? value.minute
      : ((newMins[0] ?? 0) as 0 | 30);

    onChange({ hour, minute });
  }

  function handleMinuteChange(minute: number) {
    onChange({ ...value, minute: minute as 0 | 30 });
  }

  // 현재 value가 유효 범위를 벗어났을 경우 첫 번째 유효값으로 안전하게 표시
  const safeHour = availableHours.includes(value.hour)
    ? value.hour
    : (availableHours[0] ?? 0);
  const safeMinute = availableMinutes.includes(value.minute)
    ? value.minute
    : ((availableMinutes[0] ?? 0) as 0 | 30);

  return (
    <div className='relative w-full' style={{ height: CONTAINER_HEIGHT }}>
      {/*
       * z-index 레이어 구조:
       *   0 (bottom) — 선택 배경 (bg-gray-50)
       *  10 (middle) — 컬럼 텍스트 (columns wrapper)
       *  20 (top)    — 선택 테두리 (pointer-events:none)
       * → 텍스트가 배경 위에 표시되면서 테두리가 그 위를 감쌈
       */}

      {/* Layer 0: 선택 배경 */}
      <div
        className='absolute inset-x-6 rounded-2xl bg-gray-50'
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          height: ITEM_HEIGHT,
          zIndex: 0,
        }}
      />

      {/* Layer 10: 컬럼 */}
      <div
        className='relative flex h-full items-center justify-center'
        style={{ zIndex: 10 }}
      >
        <div className='flex-1'>
          <TimeWheelColumn
            items={availableHours}
            value={safeHour}
            onChange={handleHourChange}
            formatItem={String}
          />
        </div>

        <span
          className='shrink-0 px-1 text-2xl font-bold text-gray-800 select-none'
          aria-hidden='true'
        >
          :
        </span>

        <div className='flex-1'>
          <TimeWheelColumn
            items={availableMinutes.length > 0 ? availableMinutes : ALL_MINUTES}
            value={safeMinute}
            onChange={handleMinuteChange}
            formatItem={(n) => String(n).padStart(2, '0')}
          />
        </div>
      </div>

      {/* Layer 20: 선택 테두리 */}
      <div
        className='pointer-events-none absolute inset-x-6 rounded-2xl border border-gray-200'
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          height: ITEM_HEIGHT,
          zIndex: 20,
        }}
      />
    </div>
  );
}
