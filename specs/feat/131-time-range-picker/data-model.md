# Data Model: Time Range Picker (날짜 선택 페이지 통합)

**Phase 1 출력** | Updated: 2026-04-20

본 문서는 `/date` 페이지 통합 시점의 데이터 모델을 정의한다. feature 내부 런타임 타입(`TimeValue`/`TimeRange`)과 서버 전송 직렬화 타입(`TimeRangePayload`), `CreateMeetRequest` 확장을 한 자리에 모은다.

---

## 1. 런타임 타입 (feature 내부)

위치: `src/features/time-range-select/model/types.ts` (기존 유지)

```ts
type Minute = 0 | 30;

export interface TimeValue {
  hour: number; // 0~23
  minute: Minute;
}

export interface TimeRange {
  startTime: TimeValue | null;
  endTime: TimeValue | null;
}

export interface TimeOption {
  value: TimeValue;
  label: string; // "HH:mm"
  isDisabled: boolean;
}
```

### 불변식

- `TimeValue.hour` ∈ `{0, …, 23}` 정수.
- `TimeValue.minute` ∈ `{0, 30}` — 타입 레벨에서 강제.
- 완성된 범위: `startTime !== null && endTime !== null`.
- 유효한 범위: `timeToMinutes(endTime) > timeToMinutes(startTime)` (자정 교차 금지).

---

## 2. 서버 직렬화 타입

위치: `src/entities/meet/dto/meet.dto.ts` (확장)

```ts
const TIME_PATTERN = /^([01]\d|2[0-3]):(00|30)$/;

export const timeRangeDto = z
  .object({
    startTime: z
      .string()
      .regex(TIME_PATTERN, '시각은 "HH:mm" 형식이어야 합니다.'),
    endTime: z
      .string()
      .regex(TIME_PATTERN, '시각은 "HH:mm" 형식이어야 합니다.'),
  })
  .refine(({ startTime, endTime }) => startTime < endTime, {
    message: 'endTime은 startTime보다 커야 합니다.',
    path: ['endTime'],
  });

export type TimeRangePayload = z.infer<typeof timeRangeDto>;
// => { startTime: string; endTime: string }
```

### 불변식

- 두 필드 모두 정규식 `^([01]\d|2[0-3]):(00|30)$` 매치.
- `startTime < endTime` 사전식 비교(leading zero 보장).
- `"HH:mm"` 라벨은 로컬 타임존 기준으로 해석되며, 타임존 변환은 없다.

### 변환 규칙 (런타임 → 서버)

```ts
// src/features/time-range-select/lib/timeUtils.ts (기존)
formatTime({ hour, minute }): string // => "HH:mm"

// 호출 지점(features/meet-create-date/ui/DateSelectPage.tsx 근처)
const payload: TimeRangePayload | undefined = isTimeRangeEnabled && range
  ? { startTime: formatTime(range.startTime), endTime: formatTime(range.endTime) }
  : undefined;
```

---

## 3. `CreateMeetRequest` 확장

위치: `src/entities/meet/dto/meet.dto.ts` (확장)

```ts
export const createMeetRequestDto = z.object({
  title: z.string().min(1, '모임 이름은 필수입니다.'),
  hostName: z.string().min(1, '모임장 이름은 필수입니다.'),
  dates: z.array(z.string()).min(1, '날짜를 선택해주세요.'),
  timeRange: timeRangeDto.optional(),
});

export type CreateMeetRequest = z.infer<typeof createMeetRequestDto>;
// => {
//   title: string;
//   hostName: string;
//   dates: string[];
//   timeRange?: { startTime: string; endTime: string };
// }
```

### 직렬화 동작

- `timeRange`가 `undefined`이면 `createMeetRequestDto.parse()` 결과 객체에 키가 포함되지 않아 `JSON.stringify`에서 자연스럽게 누락된다 → 토글 OFF 시 body에 `timeRange` 필드가 존재하지 않음을 보장(SC-004).
- `timeRange`가 존재하면 `refine` 단계에서 순서 불변식을 재검증한다(SC-003 보조 차단).

---

## 4. feature 상태 훅 (변경 없음)

위치: `src/features/time-range-select/model/useTimeRangeSelect.ts` (유지)

```ts
useTimeRangeSelect({
  initialStartTime?: TimeValue,
  initialEndTime?: TimeValue,
  onChange?: (range: { startTime: TimeValue; endTime: TimeValue }) => void,
}): {
  startTime: TimeValue | null;
  endTime: TimeValue | null;
  isComplete: boolean;
  isValid: boolean;
  handleStartTimeChange(v: TimeValue): void;
  handleEndTimeChange(v: TimeValue): void;
  endTimeOptions: TimeOption[];
  allSlots: TimeValue[];
}
```

동작 규칙(기존 유지):

1. `handleStartTimeChange`는 startTime을 갱신하고, 기존 endTime이 새 startTime 이하이면 endTime을 `null`로 초기화한다.
2. `handleEndTimeChange`는 `isValidTimeRange`가 `false`면 무시한다.
3. `onChange`는 start·end가 모두 설정된 경우에만 호출한다.

---

## 5. 컴포넌트 인터페이스 (Phase 1 갱신)

### 5.1 `TimeRangePicker` (재설계)

위치: `src/features/time-range-select/ui/TimeRangePicker.tsx`

```ts
interface TimeRangePickerProps {
  isEnabled: boolean;
  onEnabledChange: (next: boolean) => void;
  initialStartTime?: TimeValue; // 기본 { hour: 9, minute: 0 }
  initialEndTime?: TimeValue; // 기본 { hour: 12, minute: 0 }
  onRangeChange?: (
    range: { startTime: TimeValue; endTime: TimeValue } | null,
  ) => void;
}
```

동작 보장:

- 섹션 헤더 `시간 투표 받기` + 우측 토글(`shared/ui/toggle/Toggle`).
- 토글 ON일 때만 `시작 시간` / `종료 시간` 카드(`HH : mm`) 노출.
- 카드 탭 → 바텀 시트(`shared/ui/bottom-sheet/BottomSheet`) 내 `TimeWheelPicker` + `확인` 버튼.
- 바텀 시트 `확인` 확정 후 `isValidTimeRange(start, end)`이 true일 때만 `onRangeChange(range)` 호출, 그 외에는 `onRangeChange(null)`.
- 토글 OFF로 전환 시 내부 상태는 유지하되 `onRangeChange(null)`을 호출한다.

### 5.2 `TimeWheelPicker` (기존 유지)

```ts
interface TimeWheelPickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  minTime?: TimeValue; // 종료 휠에 start 전달
  maxTime?: TimeValue; // 시작 휠에 end 전달
}
```

### 5.3 `shared/ui/toggle/Toggle` (신규)

```ts
interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
}
```

- `role="switch"`, `aria-checked={checked}`를 렌더한다.
- 키보드: Space/Enter로 토글. 포커스 링 표시.
- 시각: Tailwind + CVA — `on`/`off` variant, 44px 최소 터치 영역.

---

## 6. 엔티티 관계 요약

```
DateSelectPage (UI 상태 소유)
  ├─ selectedDates: Date[]      ← host-range-selector/useDateSelection
  ├─ isTimeRangeEnabled: boolean
  └─ timeRange: { startTime: TimeValue; endTime: TimeValue } | null
        │
        ▼ (유효하고 토글 ON일 때만)
  formatTime × 2  →  TimeRangePayload
        │
        ▼
  useDateSelect.handleNext(formattedDates, timeRangePayload?)
        │
        ▼
  createMeeting(CreateMeetRequest with optional timeRange)
        │
        ▼
  POST /v1/meeting  →  { id }
```
