# Feature Specification: Time Range Picker (날짜 선택 페이지 통합)

**Feature Branch**: `feat/#131-time-range-picker`
**Created**: 2026-04-06
**Updated**: 2026-04-20
**Status**: Draft (Rewritten — UI finalized)
**GitHub Issue**: #131

## Overview

모임 생성 2단계(`/date`)에서 호스트가 **날짜 범위 선택** 직후 **시간 투표 받기 여부**를 토글로 선택하고, 활성화 시 **투표 가능한 시작/종료 시각**을 30분 단위로 지정할 수 있도록 한다.

Figma에서 확정된 UI는 다음과 같다.

1. 상단: 월 달력(기존 `ReactDatepickerAdapter`)을 통한 날짜 복수 선택
2. 중단: `시간 투표 받기` 헤더 + 우측 토글 스위치
3. 하단(토글 ON 시): `시작 시간` / `종료 시간` 두 줄 — 각 줄은 `HH : mm` 카드(테두리 라운드, 가운데 정렬) 형태로 표시되며, 탭하면 바텀 시트의 iOS 스타일 휠 피커가 올라온다.
4. 바텀 시트: 중앙 선택 행이 강조(라이트 회색 배경)되고, 상하 항목은 색상이 점진적으로 흐려지는 페이드 효과를 갖는다. 확인 버튼으로 값을 확정한다.
5. 최하단: `모임 만들기` CTA. 필수 조건(날짜 1개 이상, 토글 ON 시 유효한 시간 범위)을 만족할 때만 활성화된다.

`src/features/time-range-select/`에 휠 피커·범위 훅·유틸이 이미 구현되어 있으므로, 본 피처의 핵심은 **기존 컴포넌트를 Figma 최종 UI에 맞게 정돈하고 `/date` 페이지에 통합하여, 확정된 요청 바디 스키마로 모임을 생성하는 것**이다.

## Clarifications

### Session 2026-04-20

- Q: 시간 범위 미설정(토글 OFF) 시 서버로 전송되는 `timeRange` 값은? → A: 요청 바디에서 `timeRange` 필드를 생략한다(선택 필드).
- Q: 초기 시간 기본값은? → A: Figma 기준 `시작 09:00 / 종료 12:00`.
- Q: 자정 교차(예: 22:00 ~ 02:00) 허용 여부? → A: 불허. `endTime`은 `startTime`보다 엄격히 커야 한다.
- Q: `maxParticipantCount`는 이 피처에서 다루는가? → A: 다루지 않는다. 서버 스키마가 확장됨은 인지하되, UI 입력은 별도 티켓에서 처리한다.

## User Scenarios & Testing _(mandatory)_

### User Story 1 — 날짜만 정하고 모임 생성 (Priority: P1)

호스트가 날짜 범위만 선택하고 시간 투표는 받지 않기로 결정한다.

**Why this priority**: 기존 플로우와의 하위 호환이며, 가장 빠른 모임 생성 경로이다.

**Independent Test**: `/date?hostName=...&meetingName=...` 접속 → 날짜 1개 이상 선택 → 시간 토글 OFF 유지 → `모임 만들기` 탭 → 요청 바디에 `timeRange`가 포함되지 않은 채 모임이 생성된다.

**Acceptance Scenarios**:

1. **Given** `/date`에 진입하여 시간 토글이 OFF 상태일 때, **When** 날짜를 1개 이상 선택하면, **Then** `모임 만들기` 버튼이 활성화된다.
2. **Given** 토글이 OFF인 상태에서 `모임 만들기`를 누르면, **When** `createMeeting` API가 호출될 때, **Then** 요청 바디는 `{ title, hostName, dates }` 형태로 `timeRange` 필드를 포함하지 않는다.
3. **Given** 토글 영역에 시작/종료 시간 입력이 숨겨진 상태에서, **When** 토글을 탭하여 ON으로 바꾸면, **Then** 시작/종료 시간 카드가 표시되고 기본값 `09:00` / `12:00`이 채워진다.

---

### User Story 2 — 시간 투표 받기 설정 (Priority: P1)

호스트가 날짜 범위에 더해 하루 중 투표 가능한 시간 범위를 30분 단위로 지정한다.

**Why this priority**: 본 이슈의 핵심 가치. 시간대 범위를 지정하지 못하면 참여자 투표 화면에서 슬롯이 하루 전체가 되어 선택 피로도가 높아진다.

**Independent Test**: 토글 ON → `시작 시간` 카드를 탭하면 바텀 시트 휠 피커가 열린다. 원하는 시각을 스크롤로 맞추고 확인을 탭하면 해당 값이 카드에 반영된다. 종료 시간도 동일하게 지정한다.

**Acceptance Scenarios**:

1. **Given** 토글이 ON이고 `시작 시간` 카드가 보이는 상태에서, **When** 카드를 탭하면, **Then** 바텀 시트가 열리고 제목 `시작 시간`과 함께 시/분 휠 피커가 표시된다.
2. **Given** 바텀 시트가 열린 상태에서, **When** 시 컬럼·분 컬럼을 각각 스크롤하면, **Then** 중앙 강조 행의 값이 실시간으로 바뀐다.
3. **Given** 휠 피커에서 `10 : 30`으로 맞춘 상태에서, **When** 확인 버튼을 탭하면, **Then** 바텀 시트가 닫히고 `시작 시간` 카드 표시가 `10 : 30`으로 갱신된다.
4. **Given** 유효한 `시작 시간(09:00)`과 `종료 시간(12:00)`이 설정된 상태에서, **When** `모임 만들기`를 탭하면, **Then** 요청 바디는 `{ title, hostName, dates, timeRange: { startTime: "09:00", endTime: "12:00" } }` 형태로 전송된다.

---

### User Story 3 — 잘못된 범위 방지 (Priority: P1)

종료 시각이 시작 시각보다 이르거나 같은 경우가 원천적으로 발생하지 않아야 한다.

**Why this priority**: 유효하지 않은 시간 범위는 투표 화면 렌더링 오류로 이어진다.

**Independent Test**: 시작 시간을 변경했을 때 종료 시간 휠 피커의 선택 가능 범위가 조정되는지, 그리고 범위가 깨지면 CTA가 비활성화되는지 확인한다.

**Acceptance Scenarios**:

1. **Given** `시작 시간 = 10:00`인 상태에서, **When** `종료 시간` 휠 피커를 열면, **Then** 10:00 이하의 모든 옵션은 휠에서 노출되지 않거나 선택 불가로 처리된다.
2. **Given** 시작이 종료보다 늦어지는 상태(예: 종료가 이미 11:00인데 시작을 12:00으로 변경)에서, **When** 시작 시간을 확정하면, **Then** 종료 시간은 자동으로 `시작 시간 + 30분`으로 보정되거나 재선택을 요구한다.
3. **Given** 종료 시간이 유효하지 않은 상태에서, **When** `모임 만들기` 버튼을 보면, **Then** 버튼은 비활성화되어 있다.

---

### User Story 4 — 테스트 페이지에서 독립 검증 (Priority: P3)

개발자·디자이너가 `/test/time-picker`에서 `TimeRangePicker` 컴포넌트만 독립적으로 검증한다.

**Why this priority**: QA와 디자인 QA 사이클을 빠르게 돌리기 위한 개발 편의 경로이다.

**Independent Test**: `/test/time-picker`에 접속하여 휠 피커·확인 버튼 동작, 토글 UX를 페이지 통합 전 수준에서 단독 점검한다.

**Acceptance Scenarios**:

1. **Given** 테스트 페이지에 접속한 상태에서, **When** `TimeRangePicker`가 렌더링되면, **Then** 섹션 헤더, 시작/종료 시간 카드, 바텀 시트 휠 피커가 Figma 스펙과 동일하게 표시된다.
2. **Given** 테스트 페이지에서 범위를 확정하면, **When** `onComplete` 콜백이 호출될 때, **Then** 화면 하단에 `HH:mm ~ HH:mm` 형태의 결과가 출력된다.

---

### Edge Cases

- **자정 교차**: `22:00 ~ 02:00` 같은 범위는 허용하지 않는다. 종료 시각은 같은 날짜 내에서 시작 시각보다 엄격히 커야 한다.
- **동일 시각**: `10:00 ~ 10:00`은 유효하지 않다.
- **토글 OFF → ON 전환**: 이전에 선택한 값이 있으면 유지하고, 없으면 `09:00 / 12:00`을 기본값으로 사용한다.
- **토글 ON → OFF 전환**: 이전 값을 상태에 유지하되, 요청 바디에는 포함하지 않는다.
- **작은 화면(≤320px)**: 바텀 시트 휠 컬럼이 레이아웃을 벗어나지 않아야 한다.
- **로컬 타임존**: 표시는 항상 로컬 기준 `00:00~23:30`이며, 전송 값도 그대로 `"HH:mm"` 문자열이다(타임존 변환 없음).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: `/date` 페이지는 달력 아래에 `시간 투표 받기` 섹션 헤더와 토글 스위치를 표시해야 한다.
- **FR-002**: 토글이 ON일 때만 `시작 시간`·`종료 시간` 카드가 표시되어야 하며, 토글 OFF로 복귀 시 카드는 숨겨져야 한다.
- **FR-003**: 각 시간 카드를 탭하면 바텀 시트에서 시(0~23)·분(00, 30) 휠 컬럼을 가진 피커가 열려야 한다.
- **FR-004**: 시스템은 선택 가능한 시간 옵션을 30분 단위로 제공해야 한다.
- **FR-005**: 시스템은 종료 시각이 시작 시각과 같거나 이른 값으로 확정되는 것을 방지해야 한다(피커 내 옵션 필터링 또는 자동 보정).
- **FR-006**: 시간 범위 초기값은 `시작 09:00 / 종료 12:00`으로 한다.
- **FR-007**: `TimeRangePicker` 컴포넌트는 props로 초기값과 완료·토글 콜백을 주입받아 `/date` 페이지와 `/test/time-picker` 페이지에서 동일하게 재사용되어야 한다.
- **FR-008**: `모임 만들기` 버튼은 다음 조건을 모두 만족할 때만 활성화되어야 한다. (1) 날짜가 1개 이상 선택됨. (2) 시간 토글이 OFF이거나, 토글이 ON일 때 유효한 `startTime < endTime` 범위가 지정됨.
- **FR-009**: `createMeeting` 요청 바디는 토글 상태에 따라 다음 두 형태 중 하나여야 한다.
  - 토글 OFF: `{ title, hostName, dates }`
  - 토글 ON: `{ title, hostName, dates, timeRange: { startTime: "HH:mm", endTime: "HH:mm" } }`
- **FR-010**: 서버 요청용 DTO(`createMeetRequestDto`)는 optional `timeRange` 필드를 허용하도록 확장되어야 한다.
- **FR-011**: 시간 범위가 지정된 상태에서 Amplitude 이벤트(`host_create_meeting_cta_click` 등)에 시간 범위 선택 여부가 추적 속성으로 포함되어야 한다.
- **FR-012**: 모바일 터치(스크롤·탭)와 데스크톱 마우스/휠 모두에서 휠 피커가 동작해야 한다.

### Key Entities

- **TimeValue**: `{ hour: 0..23, minute: 0 | 30 }` — 로컬 기준 시각. 이미 `src/features/time-range-select/model/types.ts`에 정의됨.
- **TimeRange (요청)**: `{ startTime: "HH:mm", endTime: "HH:mm" }` — API 요청 바디에 포함되는 직렬화 형태. `formatTime(TimeValue)`를 통해 생성.
- **CreateMeetRequest (확장)**: 기존 `{ title, hostName, dates }`에 `maxParticipantCount?: number`, `timeRange?: TimeRange` 두 옵셔널 필드가 추가된 서버 스키마. 본 피처는 그중 `timeRange`만 사용한다.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 호스트가 `/date` 진입 후 날짜·시간 모두 확정하고 `모임 만들기`까지 소요되는 시간이 60초 이내이다.
- **SC-002**: iOS Safari / Android Chrome / 데스크톱 Chrome 3개 환경에서 토글 ON·OFF 전환, 휠 피커 스크롤·확정, CTA 활성화 규칙이 동일하게 동작한다.
- **SC-003**: 유효하지 않은 시간 범위(`endTime ≤ startTime`)로 서버 요청이 발생하는 비율이 0%이다(클라이언트에서 100% 차단).
- **SC-004**: 토글 OFF로 생성된 모임의 요청 바디에 `timeRange` 필드가 포함된 비율이 0%이다.
- **SC-005**: 토글 ON으로 생성된 모임의 요청 바디가 `{ startTime: "HH:mm", endTime: "HH:mm" }` 포맷 검증을 100% 통과한다.

## Assumptions

- 시간은 로컬 타임존 기준이며, 타임존 변환은 본 피처 범위 밖이다.
- 날짜 선택(`ReactDatepickerAdapter`) 및 드래그 경로 선택(#127 관련)은 이미 구현되어 있으며, 본 피처는 그 뒤의 영역만 추가·변경한다.
- `maxParticipantCount` UI 입력은 별도 티켓에서 처리하며, 본 피처에서는 DTO 스키마 확장만 고려한다(값 미포함 전송).
- `src/features/time-range-select/`의 `TimeRangePicker`, `TimeWheelPicker`, `useTimeRangeSelect`, `timeUtils`는 대부분 재사용 가능하며, Figma 시각 스펙에 맞춘 스타일 정돈과 토글·카드 레이아웃 변경 정도가 필요하다.
- 바텀 시트는 공용 `@/shared/ui/bottom-sheet/BottomSheet`를 계속 사용한다.
- 디자인 토큰(Pretendard GOV 폰트, `text/primary`, `line/nonclickable` 등)은 이미 프로젝트에 정의되어 있거나, 없을 경우 가장 유사한 기존 토큰을 사용한다.
