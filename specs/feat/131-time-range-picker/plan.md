# Implementation Plan: Time Range Picker (날짜 선택 페이지 통합)

**Branch**: `feat/#131-time-range-picker` | **Date**: 2026-04-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/feat/131-time-range-picker/spec.md`

## Summary

모임 생성 2단계(`/date`)에 `시간 투표 받기` 토글과 `시작/종료 시간` 카드 + iOS 스타일 바텀 시트 휠 피커를 통합한다. `src/features/time-range-select/`에 이미 구현된 `TimeRangePicker`·`TimeWheelPicker`·`useTimeRangeSelect`·`timeUtils`를 Figma 최종 UI(토글 스위치, 카드 레이아웃, 09:00/12:00 기본값, 자정 교차 금지)에 맞게 정돈하고, `meet-create-date` 피처의 `useDateSelect` 훅 및 `DateSelectPage`가 토글 상태·시간 범위를 받아 `createMeeting`을 호출하도록 연결한다. `entities/meet`의 `createMeetRequestDto`는 optional `timeRange: { startTime, endTime }` 필드를 허용하도록 확장한다(토글 OFF 시 필드 생략).

## Technical Context

**Language/Version**: TypeScript 5
**Primary Dependencies**: React 19, Next.js 16 (App Router), Tailwind CSS 4 + CVA + clsx + tailwind-merge, vaul(바텀 시트 — `@/shared/ui/bottom-sheet/BottomSheet`에서 캡슐화), date-fns ^4.1.0, react-datepicker ^9.1.0(기존), ky(HTTP), zod(검증), Amplitude(analytics)
**Storage**: N/A — 클라이언트 상태만. 서버 저장은 `POST /v1/meeting` 바디에 직렬화된 `timeRange`로 단발 전송.
**Testing**: Vitest(단위: `timeUtils`, `useTimeRangeSelect`, DTO 검증), Playwright(선택: `/date` 플로우 E2E). 현재 저장소에 `src/features/time-range-select/lib/timeUtils.test.ts`가 이미 존재.
**Target Platform**: 모바일 웹 우선(iOS Safari / Android Chrome), 데스크톱 Chrome 보조. 뷰포트 폭 ≥320px.
**Project Type**: Single Next.js 앱 (`src/` 단일 트리) — FSD 구조.
**Performance Goals**: 휠 스크롤 60fps, 바텀 시트 open/close < 200ms, `/date` 최초 인터랙션 가능 시점 < 1s(캐시된 상태).
**Constraints**:

- 토글 OFF 시 요청 바디에 `timeRange` 필드가 절대 포함되지 않아야 함(SC-004, 0%).
- `endTime > startTime` 엄격 강제(자정 교차 불허) — 100% 클라이언트 차단(SC-003).
- 시간 옵션은 30분 단위(`minute ∈ {0, 30}`) 고정.
- 로컬 타임존 기준으로 `"HH:mm"` 문자열 그대로 전송(타임존 변환 없음).
  **Scale/Scope**: UI 기준 단일 페이지(`/date`) + 개발용 테스트 페이지(`/test/time-picker`) 1곳. 영향 파일 ≈ 8개(entities DTO/api 2, feature model/ui 4, app page 1, amplitude 이벤트 1). 신규 컴포넌트 라인 수 < 400.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                       | Status  | Evidence                                                                                                                                                                                                 |
| ------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. FSD 레이어                   | ✅ PASS | `app/date/page.tsx` → `features/meet-create-date/ui/DateSelectPage.tsx` → `features/time-range-select/ui/TimeRangePicker.tsx` → `entities/meet/api/createMeeting.ts` 방향 단방향.                        |
| II. 프로젝트 구조(`src/`)       | ✅ PASS | 모든 변경이 `src/` 하위에 위치(`apps/`/`packages/` 아님 — 단일 앱 구조).                                                                                                                                 |
| III. No Barrel Exports          | ✅ PASS | 각 파일 직접 import 유지(`@/features/time-range-select/ui/TimeRangePicker` 등).                                                                                                                          |
| IV. Unidirectional Dependencies | ✅ PASS | `lib(timeUtils) → model(useTimeRangeSelect) → ui(TimeRangePicker/WheelPicker/WheelColumn)` 순서 유지. `shared/ui/bottom-sheet`·`shared/ui/button`·`shared/ui/checkbox`만 의존. `shared`는 도메인 미참조. |
| V. Consistent Code Style        | ✅ PASS | `export default function ...` 컴포넌트, `use...` 훅 네이밍, `handle...` 이벤트 핸들러, `is/has/should` boolean 접두사. 신규 DTO 필드도 camelCase.                                                        |

**결과**: 모든 게이트 통과. `Complexity Tracking` 섹션은 비워둔다.

위반 후보 검토:

- **Toggle 스위치**: 현재 `src/shared/ui/`에 Toggle/Switch 컴포넌트가 없다. 도메인 비의존이므로 `shared/ui/toggle/Toggle.tsx`에 신규 추가하는 것이 원칙상 자연스럽다. feature 내부에 숨기면 재사용이 어렵고, shared에 두어도 다른 도메인을 참조하지 않으므로 레이어 규칙 위반이 없다.
- **Skip 체크박스 → Toggle 이관**: 기존 `TimeRangePicker.tsx`의 `onSkip` + Checkbox UI는 Figma 스펙상 상단 토글로 이동한다. feature의 public API를 `isEnabled` / `onToggle` 중심으로 재설계해도 FSD 레이어와 의존 방향에는 영향 없음(구조 변경이 아닌 동일 레이어 내 시그니처 변경).

## Project Structure

### Documentation (this feature)

```text
specs/feat/131-time-range-picker/
├── plan.md              # This file (/speckits:plan output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output — decisions & rationale
├── data-model.md        # Phase 1 output — entities and schema
├── contracts/
│   └── create-meeting.md  # POST /v1/meeting 확장 계약
└── tasks.md             # /speckits:tasks 에서 생성 예정 (이 명령에서는 생성하지 않음)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── date/
│   │   └── page.tsx                                    # [수정] searchParams → DateSelectPage props 유지
│   └── test/
│       └── time-picker/
│           └── page.tsx                                # [수정] 토글 기반 API로 정렬(User Story 4)
│
├── features/
│   ├── meet-create-date/
│   │   ├── model/
│   │   │   └── useDateSelect.ts                        # [수정] timeRange 옵션 수신 → createMeeting 호출 시 조건부 포함, 토글 ON/OFF Amplitude 속성 추가
│   │   └── ui/
│   │       └── DateSelectPage.tsx                      # [수정] 달력 아래 TimeRangePicker 배치, 토글 상태/범위 상태 관리, CTA 활성화 규칙 확장
│   │
│   └── time-range-select/
│       ├── lib/
│       │   ├── timeUtils.ts                            # [유지] formatTime/timeToMinutes/isValidTimeRange/getEndTimeOptions
│       │   └── timeUtils.test.ts                       # [유지/보강] 기존 단위 테스트
│       ├── model/
│       │   ├── types.ts                                # [유지] TimeValue / TimeRange / TimeOption
│       │   └── useTimeRangeSelect.ts                   # [유지] 내부 상태 훅
│       └── ui/
│           ├── TimeRangePicker.tsx                     # [수정] 토글 + 카드 레이아웃 + 09:00/12:00 기본, props 재설계(isEnabled/onEnabledChange/onRangeChange)
│           ├── TimeWheelPicker.tsx                     # [유지] 휠 피커(이미 min/max 제약 지원)
│           └── TimeWheelColumn.tsx                     # [유지]
│
├── entities/
│   └── meet/
│       ├── dto/
│       │   └── meet.dto.ts                             # [수정] createMeetRequestDto에 optional timeRange 필드 추가(zod)
│       └── api/
│           └── createMeeting.ts                        # [유지] DTO parse로 검증(스키마 확장만으로 대응)
│
└── shared/
    └── ui/
        └── toggle/
            └── Toggle.tsx                              # [신규] iOS 스타일 토글 스위치(도메인 비의존)
```

**Structure Decision**: 단일 Next.js 앱 FSD 구조. 본 피처는 **기존 `features/time-range-select` 재배선 + `features/meet-create-date` 통합**으로 구현되며, 신규 도메인 비의존 컴포넌트인 Toggle만 `shared/ui/toggle/`에 추가한다. `entities/meet/dto/meet.dto.ts`의 `createMeetRequestDto` 확장이 서버 계약 변경 지점이며, 나머지 변경은 UI/상태 조립에 국한된다.

## Phase 0 — Outline & Research

Phase 0 결과는 [research.md](./research.md)에 기록한다. 주요 결론:

1. **Toggle 컴포넌트 위치**: `src/shared/ui/toggle/Toggle.tsx` 신규 생성. 근거: 도메인 무관, 향후 `maxParticipantCount` 등 다른 설정 토글 재사용 가능.
2. **TimeRangePicker API 재설계**: `isEnabled`/`onEnabledChange`/`onRangeChange`/`initialStartTime`/`initialEndTime` 외부 제어 방식. 기존 `onComplete`/`onSkip`은 제거(내부 확정 시점은 바텀 시트 확인 버튼으로 단일화).
3. **기본값**: `startTime = { hour: 9, minute: 0 }`, `endTime = { hour: 12, minute: 0 }` (spec Clarification 2026-04-20).
4. **자정 교차 차단**: 종료 휠의 min 제약을 startTime으로 고정해 옵션 단계에서 비활성화(기존 `getEndTimeOptions` / `TimeWheelPicker`의 `minTime` 재사용).
5. **직렬화**: `formatTime(TimeValue) → "HH:mm"` — 타임존 변환 없음.
6. **DTO 확장 방식**: `createMeetRequestDto`에 `timeRange: z.object({ startTime, endTime }).optional()` 추가. zod가 `undefined`는 직렬화에서 제외하므로 토글 OFF 시 필드가 자동으로 body에서 누락 — 추가 분기 불필요.
7. **Amplitude**: 기존 `host_create_meeting_cta_click` 이벤트에 `time_range_enabled: boolean` 속성 추가. 값 지정 시 `start_time`·`end_time`(HH:mm) 속성 동반.
8. **테스트 페이지(`/test/time-picker`)**: 새 외부 제어 API에 맞춰 토글/범위/결과 출력 로직으로 재배선.

## Phase 1 — Design & Contracts

### Entities & Data Model

자세한 엔티티 정의는 [data-model.md](./data-model.md) 참조. 요약:

- `TimeValue { hour: 0..23, minute: 0 | 30 }` (기존 유지)
- `TimeRange { startTime: TimeValue; endTime: TimeValue }` (feature 내 런타임 타입, 완료 상태)
- `TimeRangePayload { startTime: string; endTime: string }` (서버 직렬화 타입, `"HH:mm"`)
- `CreateMeetRequest` 확장: `{ title, hostName, dates, timeRange?: TimeRangePayload }`

### API Contracts

자세한 계약은 [contracts/create-meeting.md](./contracts/create-meeting.md) 참조. 요약:

- **POST** `/v1/meeting` (ky, baseURL 공용)
  - 토글 OFF: `{ title, hostName, dates }`
  - 토글 ON: `{ title, hostName, dates, timeRange: { startTime, endTime } }`
  - 검증: `createMeetRequestDto.parse(body)` — zod optional `timeRange`가 형식(regex `^([01]\d|2[0-3]):(00|30)$`)과 `startTime < endTime` 불변식을 강제.
  - 응답: 기존과 동일 `{ id }`.

### FSD Component Wiring

```text
app/date/page.tsx (Server)
  └─ features/meet-create-date/ui/DateSelectPage.tsx (Client, 조립 Page)
       ├─ features/host-range-selector/ui/ReactDatepickerAdapter
       ├─ features/time-range-select/ui/TimeRangePicker   [수정 대상]
       │    ├─ shared/ui/toggle/Toggle                    [신규]
       │    ├─ shared/ui/bottom-sheet/BottomSheet
       │    ├─ shared/ui/button/Button
       │    └─ features/time-range-select/ui/TimeWheelPicker
       ├─ shared/ui/top-bar/TopBar
       └─ shared/ui/button/Button (모임 만들기 CTA)
          └─ entities/meet/api/createMeeting  ← features/meet-create-date/model/useDateSelect 에서 호출
```

`update-agent-context.sh` 실행으로 CLAUDE.md 최상단 Recent Changes는 본 plan 생성 시점에 이미 반영된 상태(`feat/#131-time-range-picker`).

### Architecture Decision Table

| Decision                     | Options Considered                                                                                                      | Chosen                            | Rationale                                                                                                             | FSD Impact                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Toggle 컴포넌트 위치         | (a) `shared/ui/toggle/`, (b) `features/time-range-select/ui/`, (c) 인라인                                               | (a) `shared/ui/toggle/Toggle.tsx` | 도메인 비의존이며 재사용성 높음(향후 최대 인원 on/off 등).                                                            | `shared`층에 신규 파일 1개 추가, feature → shared 단방향 의존 준수.               |
| TimeRangePicker props 재설계 | (a) 기존 `onComplete`/`onSkip` 유지, (b) 외부 제어(`isEnabled`/`onEnabledChange`/`onRangeChange`)                       | (b)                               | Figma는 토글이 항상 보이는 상단 헤더. 외부(부모 `DateSelectPage`)가 토글 상태를 소유해야 CTA 활성화 조건을 계산 가능. | feature 내부에서만 시그니처 변경, 레이어 경계 영향 없음.                          |
| 기본값(09:00/12:00)          | (a) 09:00/18:00 기존값 유지, (b) 09:00/12:00(Figma)                                                                     | (b)                               | spec Clarification 2026-04-20 확정.                                                                                   | `TimeRangePicker.tsx`의 `DEFAULT_END_TIME` 상수만 변경.                           |
| 자정 교차 처리               | (a) cross-midnight 허용, (b) `endTime > startTime` 엄격                                                                 | (b)                               | spec Edge Cases, SC-003. 기존 `isValidTimeRange` 구현과 일치.                                                         | 변경 없음(기존 유틸 재사용).                                                      |
| DTO 확장 위치                | (a) 신규 DTO 분리, (b) 기존 `createMeetRequestDto` 확장                                                                 | (b)                               | API가 동일 엔드포인트·동일 베이스 페이로드. 옵셔널 필드 추가가 가장 단순.                                             | `entities/meet/dto/meet.dto.ts` 1파일 수정.                                       |
| 토글 OFF 시 body 누락 방식   | (a) 명시적 `if`로 필드 제거, (b) `timeRange: undefined` 전달 후 zod strip                                               | (b)                               | zod `z.object(...).optional()`는 `undefined`를 직렬화에서 자연 제외. 분기 최소화.                                     | `useDateSelect.ts`에서 `isEnabled ? timeRange : undefined`로 단일 라인 처리.      |
| 휠 피커 min/max 제약         | (a) 피커 내부 동적 계산, (b) 부모가 매번 계산해 props로 주입                                                            | (a)                               | `TimeWheelPicker`가 이미 `minTime`/`maxTime` props로 자체 필터링. 재작성 불필요.                                      | 변경 없음.                                                                        |
| Amplitude 확장 이벤트        | (a) 신규 이벤트 생성, (b) 기존 `host_create_meeting_cta_click`에 속성 추가                                              | (b)                               | 퍼널 단절 방지. FR-011도 속성 추가로 기술.                                                                            | `features/meet-create-date/model/useDateSelect.ts`의 `trackEvent` 호출 속성 확장. |
| 테스트 위치                  | (a) `src/features/time-range-select/lib/*.test.ts` 유지 + `useTimeRangeSelect.test.ts` 추가, (b) `tests/` 디렉토리 신설 | (a)                               | Vitest가 공동 배치(co-located) 경로를 이미 수집 중(`timeUtils.test.ts` 선례).                                         | feature 폴더에 `.test.ts` 1~2개 추가.                                             |

### Agent Context Sync

`.specify/scripts/bash/update-agent-context.sh claude` 실행 결과 CLAUDE.md 상단 Recent Changes에 `feat/#131-time-range-picker` 항목이 이미 반영되어 있어 추가 실행 없이 Phase 1을 종료한다.

## Complexity Tracking

> Constitution Check의 모든 게이트를 통과하여 위반 사항이 없다. 본 섹션은 비워둔다.
