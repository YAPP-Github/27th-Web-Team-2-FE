import type { TimeOption, TimeValue } from '../model/types';

/** 모듈 초기화 시 1회 생성되는 48개 슬롯 상수 */
const ALL_SLOTS: TimeValue[] = (() => {
  const slots: TimeValue[] = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push({ hour, minute: 0 });
    slots.push({ hour, minute: 30 });
  }
  return slots;
})();

/** 00:00~23:30, 30분 간격 48개 슬롯을 반환한다 */
export function generateTimeSlots(): TimeValue[] {
  return ALL_SLOTS;
}

/** TimeValue를 "HH:mm" 형식 문자열로 변환한다 */
export function formatTime(value: TimeValue): string {
  const hh = String(value.hour).padStart(2, '0');
  const mm = String(value.minute).padStart(2, '0');
  return `${hh}:${mm}`;
}

/** TimeValue를 자정 기준 분 단위 숫자로 변환한다 */
export function timeToMinutes(value: TimeValue): number {
  return value.hour * 60 + value.minute;
}

/** 종료 시각이 시작 시각보다 엄격히 큰지 검사한다 */
export function isValidTimeRange(start: TimeValue, end: TimeValue): boolean {
  return timeToMinutes(end) > timeToMinutes(start);
}

/** 전체 슬롯 중 시작 시각 이하는 disabled, 초과는 enabled로 반환한다 */
export function getEndTimeOptions(
  startTime: TimeValue,
  allSlots: TimeValue[],
): TimeOption[] {
  const startMinutes = timeToMinutes(startTime);
  return allSlots.map((slot) => ({
    value: slot,
    label: formatTime(slot),
    isDisabled: timeToMinutes(slot) <= startMinutes,
  }));
}
