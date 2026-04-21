# Phase 0 — Research: Time Range Picker (날짜 선택 페이지 통합)

**Feature**: `feat/#131-time-range-picker`
**Updated**: 2026-04-20 (통합 단계)
**Prior research**: 최초 `time-range-select` feature 구축(2026-04-07) 결정은 이 문서의 Appendix 참조.

이번 Phase 0은 `/date` 페이지 통합을 위해 새로 해소해야 하는 결정을 기록한다.

---

## R1. Toggle 스위치 컴포넌트 위치

- **Decision**: `src/shared/ui/toggle/Toggle.tsx`에 iOS 스타일 토글 컴포넌트를 신규 생성한다. 최소 props: `checked`, `onChange`, `disabled?`, `id?`, `ariaLabel?`. Tailwind + CVA `on`/`off` variant.
- **Rationale**:
  - 도메인 비의존이며 `shared/ui/checkbox/Checkbox.tsx`와 같은 계층이 자연스럽다.
  - 향후 `maxParticipantCount` 등 다른 설정 토글에서 재사용 가능.
  - `role="switch"` · `aria-checked` 등 접근성 책임을 shared에 귀속.
- **Alternatives considered**:
  - `features/time-range-select/ui/Toggle.tsx` 내장: 발견성·재사용성 낮음.
  - 인라인 JSX: 접근성·디자인 토큰 책임이 feature로 누수.

---

## R2. `TimeRangePicker` public API 재설계

- **Decision**: 외부 제어(controlled) 방식으로 바꾼다.

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

  기존 `onComplete`·`onSkip`은 제거한다. 내부 상태 훅(`useTimeRangeSelect`)과 `activeField`·`pendingValue` 로컬 상태는 그대로 사용.

- **Rationale**: 부모(`DateSelectPage`)가 토글 상태·범위를 모두 알아야 CTA 활성화와 요청 바디를 결정 가능. 확정 시점은 바텀 시트 "확인"으로 단일화.
- **Alternatives considered**:
  - 기존 체크박스(`onSkip`) 유지: Figma 상단 토글 스펙과 불일치.
  - `forwardRef` imperative API: controlled prop 대비 이점 없음.

---

## R3. 시간 기본값 (09:00 / 12:00)

- **Decision**: `DEFAULT_START_TIME = { hour: 9, minute: 0 }`, `DEFAULT_END_TIME = { hour: 12, minute: 0 }`.
- **Rationale**: spec Clarification 2026-04-20에서 확정. 기존 상수 `DEFAULT_END_TIME = 18:00`만 교체.
- **Alternatives considered**: 마지막 값 복원(localStorage) — 범위 외.

---

## R4. 자정 교차 금지 · `endTime > startTime` 강제

- **Decision**: UI(휠 옵션 disable, `TimeWheelPicker`의 `minTime`/`maxTime` 제약)와 서버 호출 직전 검증(zod `.refine`) 이중 차단.
- **Rationale**: SC-003(0% 위반) 보장. 기존 `isValidTimeRange`·`getEndTimeOptions` 재사용.
- **Alternatives considered**: cross-midnight 허용 — Edge Cases에서 명시적으로 불허.

---

## R5. `"HH:mm"` 직렬화 & 타임존 중립

- **Decision**: `formatTime(TimeValue) → "HH:mm"`만 사용, 타임존 변환 없음.
- **Rationale**: 서버가 로컬 라벨 문자열로 해석하는 것이 합의(FR-009, Assumptions).
- **Alternatives considered**: ISO 문자열/Date — 서버 스키마와 불일치.

---

## R6. `createMeetRequestDto` 확장 전략

- **Decision**: 단일 스키마 내 `timeRange` 옵셔널 + `startTime < endTime` `refine`.

  ```ts
  const TIME_PATTERN = /^([01]\d|2[0-3]):(00|30)$/;
  const timeRangeDto = z
    .object({
      startTime: z.string().regex(TIME_PATTERN),
      endTime: z.string().regex(TIME_PATTERN),
    })
    .refine(({ startTime, endTime }) => startTime < endTime, {
      message: 'endTime은 startTime보다 커야 합니다.',
    });

  export const createMeetRequestDto = z.object({
    title: z.string().min(1, '모임 이름은 필수입니다.'),
    hostName: z.string().min(1, '모임장 이름은 필수입니다.'),
    dates: z.array(z.string()).min(1, '날짜를 선택해주세요.'),
    timeRange: timeRangeDto.optional(),
  });
  ```

- **Rationale**: `.optional()`은 `undefined`를 직렬화에서 제외 → 토글 OFF 시 `body.timeRange = undefined`만으로 필드가 누락되어 SC-004(0% 포함) 자동 달성. `"HH:mm"` 문자열 사전식 비교가 올바르게 동작(leading zero).
- **Alternatives considered**: 별도 요청 타입 분리(호출부 분기 비용↑), 서버 전용 검증(SC-003 미달).

---

## R7. `useDateSelect` 훅 시그니처 확장

- **Decision**: `handleNext(formattedDates, timeRangePayload?)` 형태로 시그니처를 확장한다(페이로드는 `{ startTime: string; endTime: string } | undefined`). 훅 내부는 받은 페이로드를 그대로 `createMeeting` 호출에 주입.
- **Rationale**: 상태 소유권은 UI(`DateSelectPage`)에 두고 훅은 transport 역할만 담당 — `features/time-range-select`와의 역방향 의존 방지.
- **Alternatives considered**: 훅이 `time-range-select` 내부 훅을 관통해 상태까지 소유 — 같은 레이어(feature ↔ feature) 간 교차 참조 발생.

---

## R8. Amplitude 이벤트 속성 확장

- **Decision**: 기존 `host_create_meeting_cta_click`에 속성 추가.

  ```ts
  trackEvent('host_create_meeting_cta_click', {
    total_days: formattedDates.length,
    time_range_enabled: Boolean(timeRangePayload),
    start_time: timeRangePayload?.startTime,
    end_time: timeRangePayload?.endTime,
  });
  ```

- **Rationale**: 퍼널 유지 + 옵션 사용률 추적(FR-011).
- **Alternatives considered**: 신규 이벤트(`host_time_range_set`) — 중복 이벤트로 퍼널 복잡도 증가.

---

## R9. `/test/time-picker` 페이지 정렬

- **Decision**: 새 외부 제어 API(`isEnabled`/`onEnabledChange`/`onRangeChange`)로 재배선. 토글 OFF거나 유효 범위일 때 CTA 활성화.
- **Rationale**: User Story 4(독립 QA) 요건 충족.
- **Alternatives considered**: 테스트 페이지 삭제 — 디자인 QA 편의 상실.

---

## R10. 테스트 전략

- **Decision**:
  - 기존 `src/features/time-range-select/lib/timeUtils.test.ts` 유지·보강(자정 경계, 30분 경계).
  - 신규 `src/entities/meet/dto/meet.dto.test.ts`로 `createMeetRequestDto` 확장(패턴/순서/옵셔널) 단위 테스트.
  - 컴포넌트 테스트는 jsdom 미도입 제약으로 본 이슈 범위 외(최초 research Appendix 참고). 통합 검증은 `/test/time-picker`와 `/date` 수동 QA로 대체.
- **Rationale**: 비즈니스 불변식은 순수 함수·zod 수준에서 100% 강제. UI는 환경 제약 상 수동 QA 유지.
- **Alternatives considered**: jsdom 도입 → 별도 이슈로 분리.

---

## Outstanding Unknowns

없음. 2026-04-20 Clarification 세션 이후 Technical Context 전 항목이 확정되었다.

---

## Appendix — 2026-04-07 초기 결정 요약(참고용)

| 항목               | 결정                                             |
| ------------------ | ------------------------------------------------ |
| 타임피커 UI        | 커스텀 휠(`TimeWheelColumn` + `TimeWheelPicker`) |
| 시간 값 타입       | `{ hour: number, minute: 0 \| 30 }`              |
| TDD 대상           | `lib/timeUtils.ts` 순수 함수 (Vitest node env)   |
| 유효성 처리        | 종료 옵션에서 시작 이하 슬롯 disable             |
| 테스트 페이지 경로 | `src/app/test/time-picker/page.tsx`              |

본 통합 단계는 위 결정을 승계하고, 상단 R1~R10으로 확장한다.
