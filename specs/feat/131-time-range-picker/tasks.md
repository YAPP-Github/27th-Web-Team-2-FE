---
description: 'Task list for feat/#131-time-range-picker — 날짜 선택 페이지에 시간 투표 토글/휠 피커 통합'
---

# Tasks: Time Range Picker (날짜 선택 페이지 통합)

**Input**: Design documents from `/specs/feat/131-time-range-picker/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/create-meeting.md

**Tests**: 본 피처는 Vitest 단위 테스트(순수 함수·DTO)만 포함한다. 컴포넌트 테스트는 jsdom 미도입으로 범위 외(research R10). UI 검증은 `/test/time-picker`와 `/date` 수동 QA로 수행.

**Organization**: 4개 사용자 스토리별 독립 구현·테스트가 가능하도록 구성.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 서로 다른 파일·의존 없음 → 병렬 실행 가능
- **[Story]**: US1~US4는 spec.md 사용자 스토리 매핑
- 파일 경로는 저장소 루트 기준

## Path Conventions

**본 저장소는 단일 Next.js 앱(`src/` 단일 트리) FSD 구조**이며 monorepo 아님(plan.md §Project Structure). 따라서 경로는 `apps/{app}/src/` 대신 `src/` 접두어를 사용한다.

- `src/app/` → Next.js App Router 페이지
- `src/features/{feature}/` → FSD feature (ui/model/lib)
- `src/entities/{entity}/` → 도메인 엔티티 (dto/api)
- `src/shared/ui/` → 앱 공용 UI

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 본 피처는 기존 프로젝트(Next.js 16 / Vitest 구성 완료) 위에 얹으므로 신규 setup은 최소한이다.

- [x] T001 브랜치 `feat/#131-time-range-picker` 체크아웃 확인 및 `npm install` 실행으로 `vaul`·`date-fns`·`zod` 포함 의존성 동기화
- [x] T002 [P] `npm run lint`·`npm test` 최초 실행으로 현재 트리 baseline이 green인지 확인(후속 회귀 감지용)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 사용자 스토리가 공유하는 재사용 컴포넌트·스키마·기본값. 이 단계가 끝나기 전에는 어떤 US도 착수할 수 없다.

**⚠️ CRITICAL**: Foundational 완료 전까지 US1~US4는 시작 금지.

- [x] T003 [P] iOS 스타일 Toggle 컴포넌트를 [src/shared/ui/toggle/Toggle.tsx](src/shared/ui/toggle/Toggle.tsx) 신규 생성 — props `{ checked, onChange, disabled?, id?, ariaLabel? }`, `role="switch"` · `aria-checked`, Space/Enter 키보드 지원, Tailwind + CVA `on`/`off` variant, 44px 최소 터치 영역 (data-model §5.3, research R1)
- [x] T004 [P] [src/entities/meet/dto/meet.dto.ts](src/entities/meet/dto/meet.dto.ts)에 `TIME_PATTERN` 정규식 상수(`^([01]\d|2[0-3]):(00|30)$`) + `timeRangeDto`(zod object + `refine: startTime < endTime`) + `createMeetRequestDto.timeRange.optional()` 필드를 추가하고 `TimeRangePayload` 타입 export (data-model §2~3, research R6, contracts §Validation Schema)
- [x] T005 [P] [src/features/time-range-select/ui/TimeRangePicker.tsx](src/features/time-range-select/ui/TimeRangePicker.tsx)의 `DEFAULT_START_TIME`·`DEFAULT_END_TIME` 상수를 `{ hour: 9, minute: 0 }` / `{ hour: 12, minute: 0 }`로 갱신 (spec Clarification 2026-04-20, research R3)
- [x] T006 [src/features/time-range-select/ui/TimeRangePicker.tsx](src/features/time-range-select/ui/TimeRangePicker.tsx) public API를 controlled 방식으로 재설계: props `{ isEnabled, onEnabledChange, initialStartTime?, initialEndTime?, onRangeChange? }`로 교체, 기존 `onComplete`·`onSkip` 제거, 섹션 헤더(`시간 투표 받기`) + 우측 Toggle + 토글 ON일 때만 `시작 시간`/`종료 시간` 카드 노출 골격까지 구현 (data-model §5.1, research R2, FR-001~FR-003)
- [x] T007 T006 완료 후, `TimeRangePicker` 내부에서 `isValidTimeRange(start, end)`가 true일 때만 `onRangeChange({ startTime, endTime })`, 그 외(토글 OFF 포함 및 부분 선택)는 `onRangeChange(null)`를 호출하도록 상태-콜백 동기화 로직 연결 (data-model §5.1 동작 보장)

**Checkpoint**: Toggle 컴포넌트·DTO 확장·TimeRangePicker 신규 API가 준비되어 US1~US4 병렬 착수 가능.

---

## Phase 3: User Story 1 — 날짜만 정하고 모임 생성 (Priority: P1) 🎯 MVP

**Goal**: 호스트가 날짜 범위만 선택하고 시간 투표는 OFF로 둔 채 `모임 만들기`를 눌렀을 때, 요청 바디에 `timeRange` 필드가 **포함되지 않은** 채 모임이 생성된다.

**Independent Test**: `/date?hostName=Alice&meetingName=Test` 접속 → 달력에서 날짜 1개 이상 선택 → 시간 토글 OFF 유지 → DevTools Network에서 `POST /v1/meeting` 요청 바디에 `timeRange` 키가 없음을 확인 → 응답 `{ id }` 수신 및 다음 페이지 네비게이션.

### Implementation for User Story 1

- [x] T008 [US1] [src/features/meet-create-date/model/useDateSelect.ts](src/features/meet-create-date/model/useDateSelect.ts)의 `handleNext` 시그니처를 `handleNext(formattedDates: string[], timeRangePayload?: TimeRangePayload)`로 확장하고, 내부 `createMeeting` 호출 시 `timeRange: timeRangePayload`를 그대로 전달(undefined면 zod `.optional()`이 body에서 자동 누락) (research R7, contracts §Client Call Pattern)
- [x] T009 [US1] [src/features/meet-create-date/ui/DateSelectPage.tsx](src/features/meet-create-date/ui/DateSelectPage.tsx)에 `isTimeRangeEnabled: boolean`(초기 false)와 `timeRange: { startTime: TimeValue; endTime: TimeValue } | null`(초기 null) 상태 추가, 달력 아래에 `<TimeRangePicker isEnabled={isTimeRangeEnabled} onEnabledChange={setIsTimeRangeEnabled} onRangeChange={setTimeRange} />` 배치 (FR-001~FR-002, plan §FSD Component Wiring)
- [x] T010 [US1] T009에 이어 `DateSelectPage`의 CTA 활성화 규칙을 확장: `selectedDates.length >= 1 && (!isTimeRangeEnabled || timeRange !== null)` (FR-008)
- [x] T011 [US1] `DateSelectPage`의 CTA 핸들러에서 `const payload = isTimeRangeEnabled && timeRange ? { startTime: formatTime(timeRange.startTime), endTime: formatTime(timeRange.endTime) } : undefined;`로 직렬화 후 `useDateSelect`의 `handleNext(formattedDates, payload)`로 전달 (contracts §Client Call Pattern, data-model §2 변환 규칙, SC-004)

**Checkpoint**: US1이 독립 동작 — 토글 OFF 경로의 모임 생성이 기존 플로우와 동일하게 완결.

---

## Phase 4: User Story 2 — 시간 투표 받기 설정 (Priority: P1)

**Goal**: 호스트가 토글 ON 후 시작 시간/종료 시간 카드를 탭하여 바텀 시트 휠 피커로 30분 단위 범위를 지정하고, `{ startTime: "HH:mm", endTime: "HH:mm" }`가 요청 바디 `timeRange`에 포함된 채 모임이 생성된다.

**Independent Test**: `/date`에서 토글 ON → `시작 시간` 카드 탭 → 바텀 시트 휠 피커에서 10:30 선택 → 확인 → 카드 표시가 `10 : 30`으로 갱신 → `종료 시간`도 12:00으로 지정 → `모임 만들기` → 요청 바디 `timeRange: { startTime: "10:30", endTime: "12:00" }` 전송.

### Implementation for User Story 2

- [x] T012 [US2] [src/features/time-range-select/ui/TimeRangePicker.tsx](src/features/time-range-select/ui/TimeRangePicker.tsx) 내부에 `activeField: 'start' | 'end' | null` 로컬 상태와 `시작 시간`/`종료 시간` 카드(`HH : mm` 라운드 카드, 가운데 정렬) UI를 Figma 스펙대로 구현, 카드 탭 시 `activeField`를 세팅하여 바텀 시트를 연다 (FR-003, spec Overview §3)
- [x] T013 [US2] `TimeRangePicker`가 `@/shared/ui/bottom-sheet/BottomSheet`을 사용해 바텀 시트를 열고, 내부에 `TimeWheelPicker`(기존 컴포넌트) + `확인` 버튼을 렌더 — `pendingValue: TimeValue` 로컬 상태에 휠 변경을 반영, `확인` 탭 시 `useTimeRangeSelect`의 `handleStartTimeChange`/`handleEndTimeChange`로 확정 후 바텀 시트 닫기 (FR-003, FR-004, data-model §5.1)
- [x] T014 [US2] 바텀 시트 내 `TimeWheelPicker`에 `minTime`/`maxTime` 제약 전달 — `activeField === 'end'`일 때 `minTime = startTime`, `activeField === 'start'`일 때 `maxTime = endTime`(이미 설정된 경우) (data-model §5.2, FR-005 전단 차단)
- [x] T015 [US2] [src/features/meet-create-date/model/useDateSelect.ts](src/features/meet-create-date/model/useDateSelect.ts)의 `host_create_meeting_cta_click` Amplitude 이벤트에 속성 `{ total_days, time_range_enabled: Boolean(timeRangePayload), start_time: timeRangePayload?.startTime, end_time: timeRangePayload?.endTime }` 추가 (FR-011, research R8)
- [x] T016 [US2] [src/entities/meet/api/createMeeting.ts](src/entities/meet/api/createMeeting.ts) 동작 재검증(코드 변경 없음) — `createMeetRequestDto.parse`가 `timeRange` 포함/미포함 두 경우 모두 통과하는지 수동 확인, 네트워크 바디에 `timeRange: { startTime: "HH:mm", endTime: "HH:mm" }`가 정확히 직렬화되는지 확인 (contracts §Request Body)

**Checkpoint**: US1 + US2가 독립 동작 — 토글 ON으로 시간 범위 설정 후 모임 생성까지 end-to-end 성공(SC-005).

---

## Phase 5: User Story 3 — 잘못된 범위 방지 (Priority: P1)

**Goal**: 종료 시각이 시작 시각 이하로 설정되는 경우를 UI 레벨에서 100% 차단하며, 범위가 깨지면 CTA가 비활성화된다(SC-003: 0%).

**Independent Test**: 시작 10:00 → 종료 휠을 열면 10:00 이하 옵션이 선택 불가. 시작을 12:00으로 변경하면 기존 종료 11:00은 자동 무효화되어 `timeRange === null`, CTA 비활성화.

### Implementation for User Story 3

- [x] T017 [US3] [src/features/time-range-select/model/useTimeRangeSelect.ts](src/features/time-range-select/model/useTimeRangeSelect.ts) 내 `handleStartTimeChange`가 기존 `endTime <= newStartTime`인 경우 `endTime`을 `null`로 초기화하는 동작을 유지/검증하고, `handleEndTimeChange`는 `isValidTimeRange === false`면 무시하도록 보장 (data-model §4 동작 규칙)
- [x] T018 [US3] [src/features/time-range-select/lib/timeUtils.ts](src/features/time-range-select/lib/timeUtils.ts)의 `getEndTimeOptions(startTime, allSlots)`가 `timeToMinutes(slot) <= timeToMinutes(startTime)`인 모든 옵션에 `isDisabled: true`를 부여하는지 검증·보강 (FR-005 UI 필터링)
- [x] T019 [US3] [src/features/time-range-select/ui/TimeRangePicker.tsx](src/features/time-range-select/ui/TimeRangePicker.tsx)에서 종료 휠 바텀 시트를 열 때 `TimeWheelPicker`의 `minTime={startTime}`을 항상 전달하여 시작 이하 옵션이 휠 자체에서 노출되지 않도록 확정(US2의 T014 보강 수준의 회귀 가드) (FR-005, spec US3 Acceptance 1)
- [x] T020 [US3] `TimeRangePicker`에서 `handleStartTimeChange`로 인해 endTime이 null이 될 때 `onRangeChange(null)`가 즉시 호출되도록 연결(T007 정책의 재확인) — 결과적으로 부모 `DateSelectPage`의 `timeRange === null` → CTA 비활성(T010 규칙 재사용) (FR-008, spec US3 Acceptance 2~3)

**Checkpoint**: US1+US2+US3 독립 동작 — 잘못된 범위로 서버 요청이 발생할 수 없음(SC-003 0%).

---

## Phase 6: User Story 4 — 테스트 페이지에서 독립 검증 (Priority: P3)

**Goal**: 개발자·디자이너가 `/test/time-picker`에서 `TimeRangePicker`만 독립 QA 가능.

**Independent Test**: `/test/time-picker` 접속 → 섹션 헤더·토글·카드·바텀 시트가 Figma와 일치 → 범위 확정 시 하단에 `HH:mm ~ HH:mm` 결과 출력.

### Implementation for User Story 4

- [x] T021 [US4] [src/app/test/time-picker/page.tsx](src/app/test/time-picker/page.tsx)를 새 controlled API로 재배선 — `useState`로 `isEnabled`·`range`를 보유하고 `<TimeRangePicker isEnabled={...} onEnabledChange={...} onRangeChange={setRange} />` 렌더, 화면 하단에 `range`가 있으면 `${formatTime(range.startTime)} ~ ${formatTime(range.endTime)}`, 없으면 `'범위 미설정'` 표시 (research R9, spec US4 Acceptance)

**Checkpoint**: 4개 스토리 모두 독립적으로 동작.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 스토리 전반에 걸친 테스트 커버리지·품질·QA 마감.

- [x] T022 [P] [src/entities/meet/dto/meet.dto.test.ts](src/entities/meet/dto/meet.dto.test.ts) 신규 생성 — contracts §Test Plan의 6개 케이스(optional 누락/정상/regex 실패/refine 실패/동일 시각/24:00 방어) Vitest로 작성 (research R10)
- [x] T023 [P] [src/features/time-range-select/lib/timeUtils.test.ts](src/features/time-range-select/lib/timeUtils.test.ts) 보강 — 자정 경계(`23:30`), 30분 경계(`09:00`/`09:30`), `getEndTimeOptions` disable 규칙 케이스 추가 (research R10)
- [x] T024 `npm test && npm run lint` 전체 실행 및 green 확인(CLAUDE.md §Commands)
- [ ] T025 수동 QA — iOS Safari / Android Chrome / 데스크톱 Chrome 3개 환경에서 (a) 토글 OFF → 모임 생성, (b) 토글 ON → 09:00/12:00 기본값 → 모임 생성, (c) 시작 12:00로 이동 시 종료 자동 무효화, (d) ≤320px 뷰포트 레이아웃, (e) 바텀 시트 open/close < 200ms 체감 확인 (SC-001, SC-002, spec Edge Cases)
- [ ] T026 [P] DevTools Network 탭에서 토글 OFF 모임 생성 시 요청 바디에 `timeRange` 키가 없음을 캡처해 PR에 첨부(SC-004 증빙)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 의존 없음 — 즉시 시작
- **Foundational (Phase 2)**: Setup 완료 후 — 모든 US 차단
  - T003, T004, T005는 서로 다른 파일 → 병렬
  - T006은 T005(기본값 상수 교체)와 같은 파일이므로 순차
  - T007은 T006의 API 골격 위에 쌓임
- **US1 (Phase 3)**: Foundational 완료 후 — 단독 완결 가능(MVP)
- **US2 (Phase 4)**: Foundational 완료 후 — US1과 병렬 가능(파일 겹침 시 1인 작업은 순차)
- **US3 (Phase 5)**: Foundational 완료 후 — US2와 로직이 일부 겹치므로 US2 직후 통합 권장
- **US4 (Phase 6)**: Foundational 완료 후 — US1~US3과 완전 독립(서로 다른 파일)
- **Polish (Phase 7)**: US1~US3 완료 후

### User Story Dependencies

- **US1 (P1)**: Foundational 이후. DateSelectPage·useDateSelect에 timeRange 배선 추가.
- **US2 (P1)**: Foundational 이후. TimeRangePicker·TimeWheelPicker·BottomSheet 상호작용·Amplitude 속성.
- **US3 (P1)**: Foundational 이후. useTimeRangeSelect·timeUtils 로직·TimeWheelPicker `minTime` 제약.
- **US4 (P3)**: Foundational(T006~T007) 이후. `/test/time-picker` 단독.

### Within Each User Story

- US1: T008(훅 시그니처) → T009(페이지 통합) → T010(CTA 규칙) → T011(직렬화 호출) 순차
- US2: T012(카드 UI) → T013(바텀 시트/확인) → T014(min/max) → T015(Amplitude) → T016(검증)
- US3: T017(훅 동작) / T018(유틸) 병렬 → T019(UI min 주입) → T020(콜백 연결)
- US4: T021 단독

### Parallel Opportunities

- **Phase 2 foundational**: `T003 // T004 // T005` 병렬(서로 다른 파일)
- **Phase 3 US1 ↔ Phase 6 US4**: 서로 완전 독립 → 여러 개발자 있으면 병렬 가능
- **Phase 7 polish**: `T022 // T023 // T026` 병렬(각기 다른 파일/산출물)

---

## Parallel Example: Foundational (Phase 2)

```bash
# 서로 다른 파일 → 동시에 착수 가능:
Task: "Toggle 컴포넌트 생성 in src/shared/ui/toggle/Toggle.tsx"
Task: "meet.dto.ts에 timeRangeDto + createMeetRequestDto.timeRange.optional() 추가"
Task: "TimeRangePicker DEFAULT_START_TIME/DEFAULT_END_TIME 09:00/12:00로 교체"
```

## Parallel Example: Polish (Phase 7)

```bash
Task: "meet.dto.test.ts 신규 생성 (6 케이스)"
Task: "timeUtils.test.ts 보강 (자정/30분 경계)"
Task: "SC-004 증빙 스크린샷 캡처"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup(T001~T002)
2. Phase 2: Foundational(T003~T007) — Toggle + DTO + TimeRangePicker 신규 API
3. Phase 3: US1(T008~T011) — 토글 OFF 기본 경로 완결
4. **STOP & VALIDATE**: `/date`에서 시간 토글 OFF 유지 상태로 모임 생성, 요청 바디에 `timeRange` 키 없음 검증
5. 릴리스 가능한 증분(하위 호환 달성)

### Incremental Delivery

1. Setup + Foundational → 공통 기반 준비
2. US1 → 기존 플로우 하위 호환(MVP) → 데모/배포
3. US2 → 시간 투표 UI 전체 → 데모/배포
4. US3 → 엣지 방어 → 데모/배포
5. US4 → 디자인 QA 경로 마감
6. 각 스토리는 이전 스토리를 깨지 않고 가치 추가

### Parallel Team Strategy

- 개발자 A: US1 (DateSelectPage + useDateSelect)
- 개발자 B: US2 (TimeRangePicker 바텀 시트 · Amplitude)
- 개발자 C: US3 (useTimeRangeSelect/timeUtils 회귀 가드) + US4 (`/test/time-picker`)

단일 개발자 시에는 US2 → US3를 동일 PR 내 순차 처리 권장(파일 겹침).

---

## Notes

- [P] = 서로 다른 파일·의존 없음
- [Story] = spec.md 사용자 스토리 매핑
- 각 US는 독립 완결·독립 테스트 가능해야 함
- 커밋은 태스크 단위 또는 논리적 그룹 단위
- 체크포인트에서 스토리 독립 검증 후 다음 단계로 진행
- 본 저장소는 `apps/{app}/src/` monorepo 접두어를 사용하지 않으므로 경로에 `src/`를 그대로 사용
