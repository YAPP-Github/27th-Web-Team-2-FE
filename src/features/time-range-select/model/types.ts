/** 분 단위: 0 또는 30만 허용 */
type Minute = 0 | 30;

/** 타임존 독립 시각 값 객체 */
export interface TimeValue {
  hour: number; // 0~23
  minute: Minute; // 0 또는 30
}

/** 시작 시각과 종료 시각으로 구성된 시간 범위 */
export interface TimeRange {
  startTime: TimeValue | null;
  endTime: TimeValue | null;
}

/** 피커에서 표시되는 개별 시간 항목 */
export interface TimeOption {
  value: TimeValue;
  label: string;
  isDisabled: boolean;
}
