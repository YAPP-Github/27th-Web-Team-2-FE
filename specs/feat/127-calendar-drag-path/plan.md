# Implementation Plan: 캘린더 경로 기반 드래그 선택

**Branch**: `feat/#127-calendar-drag-path` | **Date**: 2026-03-29 | **Spec**: `specs/feat/127-calendar-drag-path/spec.md`
**Input**: Feature specification — 캘린더 선택 로직을 사각형 영역 선택에서 마우스가 지나간 경로만 선택되는 방식으로 변경

## Summary

캘린더의 드래그 선택 방식을 **범위(range) 기반**에서 **경로(path) 기반**으로 전환한다. 현재는 드래그 시작점과 끝점 사이의 모든 날짜가 선택되지만, 변경 후에는 마우스/터치 포인터가 실제로 지나간 셀만 선택/해제된다. `Set<number>` 기반 경로 추적으로 O(1) 중복 방지 및 실시간 시각적 피드백을 구현한다.

## Technical Context

**Language/Version**: TypeScript 5
**Primary Dependencies**: React 19, Next.js 16 (App Router), react-datepicker ^9.1.0, date-fns ^4.1.0
**Styling**: Tailwind CSS 4 + CVA + clsx + tailwind-merge
**Storage**: N/A (클라이언트 상태만 관련)
**Testing**: Vitest 4 (unit tests) + Playwright (E2E, 선택)
**Target Platform**: Web (Desktop + Mobile 브라우저)
**Project Type**: Single Next.js app
**Performance Goals**: 드래그 중 시각적 피드백 100ms 이내 (SC-002)
**Constraints**: 기존 단일 클릭 토글 기능 유지 (SC-004), 모든 캘린더 사용 화면에 동일 적용
**Scale/Scope**: 영향 범위 — 캘린더 사용 화면 4곳 (meet-create-date, participant-register-date, participant-edit-date, host-range-selector)

## Constitution Check

_GATE: PASS_

| Gate                        | Status | Notes                                                                                               |
| --------------------------- | ------ | --------------------------------------------------------------------------------------------------- |
| FSD 레이어 준수             | PASS   | 변경 대상이 `features/host-range-selector/` 내부로 한정. `lib/` → `model/` → `ui/` 의존성 방향 유지 |
| 배럴 export 금지            | PASS   | 모든 import가 개별 파일 직접 경로 사용 중                                                           |
| 단방향 의존성               | PASS   | `dateUtils.ts`(lib) → `ReactDatepickerAdapter.tsx`(ui) 방향. 역방향 없음                            |
| function declaration 스타일 | PASS   | `ReactDatepickerAdapter`는 `export function` 사용 중                                                |
| 변수 네이밍                 | PASS   | boolean: `isDragging`, `isSelectMode` / 핸들러: `handleMouseDown` 등                                |

## Project Structure

### Documentation (this feature)

```text
specs/feat/127-calendar-drag-path/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 research output
├── data-model.md        # Phase 1 data model
└── tasks.md             # Phase 2 output (NOT created by plan)
```

### Source Code (변경 대상)

```text
src/
├── features/
│   └── host-range-selector/       # <-- 핵심 변경 대상
│       ├── lib/
│       │   ├── dateUtils.ts        # 신규 헬퍼 추가 + generateDateRange 유지
│       │   └── dateUtils.test.ts   # [NEW] TDD 단위 테스트
│       ├── model/
│       │   ├── types.ts            # 기존 유지 (HostRangeSelectorProps 변경 없음)
│       │   └── useDateSelection.ts # 변경 없음
│       └── ui/
│           └── ReactDatepickerAdapter.tsx  # 드래그 로직 전면 리팩토링
│
├── vitest.config.ts               # [NEW] Vitest 설정 (경로 alias 포함)
└── (다른 features — 변경 없음, ReactDatepickerAdapter를 import하므로 자동 적용)
```

**Structure Decision**: 단일 feature (`host-range-selector`) 내부 변경만으로 충분. 이 feature의 `ReactDatepickerAdapter`를 다른 4개 feature가 import하므로 동작이 자동 전파됨.

## Architecture Decision Table

| #   | Decision                 | Options Considered                             | Chosen                     | Rationale                                      | FSD Impact      |
| --- | ------------------------ | ---------------------------------------------- | -------------------------- | ---------------------------------------------- | --------------- |
| 1   | 경로 추적 자료구조       | `Set<number>` / `Map<number,Date>` / `Date[]`  | `Set<number>`              | O(1) lookup, 메모리 효율, 중복 자연 방지       | 없음 (lib 내부) |
| 2   | 빠른 드래그 건너뛰기     | 보간(interpolation) / 이벤트 기반만            | 이벤트 기반만              | 스펙 명시 + 셀 크기 충분 + 복잡도 절약         | 없음            |
| 3   | 터치 감지 방식           | `elementFromPoint` 유지 / IntersectionObserver | `elementFromPoint` 유지    | 이미 검증된 패턴, 경로 추적과 호환             | 없음            |
| 4   | `generateDateRange` 처리 | 삭제 / 유지                                    | 유지                       | 다른 곳에서 재사용 가능성 + 삭제 불필요        | 없음            |
| 5   | 테스트 환경              | jsdom / browser mode / node                    | node (순수 로직)           | dateUtils는 DOM 비의존, 순수 함수              | 없음            |
| 6   | 시각적 피드백: 제거 모드 | 동일 하이라이트 / 차별 스타일                  | 차별 스타일 (bg-slate-300) | 사용자가 추가/제거 의도를 직관적으로 구분 가능 | 없음 (ui 내부)  |

## TDD Implementation Strategy

### 원칙

모든 구현은 **Red → Green → Refactor** 사이클을 따른다.

1. **Red**: 실패하는 테스트를 먼저 작성
2. **Green**: 테스트를 통과하는 최소한의 코드 작성
3. **Refactor**: 중복 제거 및 구조 개선 (테스트 통과 유지)

### Layer 1: 순수 로직 테스트 (dateUtils.test.ts)

Vitest unit test. DOM/React 비의존. **구현보다 먼저 작성**.

#### Test Suite: `normalizeDateTimestamp`

```
T1-1: 같은 날짜의 다른 시간 → 동일한 timestamp 반환
T1-2: 다른 날짜 → 다른 timestamp 반환
```

#### Test Suite: `pathSetToDates`

```
T2-1: 빈 Set → 빈 배열
T2-2: 단일 timestamp → 단일 Date 배열
T2-3: 복수 timestamp → 정렬된 Date 배열
T2-4: 비연속 timestamp → 비연속 Date 배열 (정렬됨)
```

#### Test Suite: `toggleDatesSmart` (기존 함수, 경로 기반 입력 테스트 추가)

```
T3-1: 빈 selection + 비연속 경로 [3/5, 3/7, 3/10] → 3개 날짜 추가
T3-2: [3/5, 3/6, 3/7] 선택 상태 + 경로 [3/5, 3/6] → 3/5, 3/6 제거 (3/7 유지)
T3-3: [3/5] 선택 상태 + 경로 [3/5, 3/7, 3/10] → 3개 모두 제거 (시작 셀이 선택됨 → 제거 모드)
T3-4: [] 선택 상태 + 경로 [3/5] → 단일 클릭 동작, 3/5 추가
T3-5: [3/5] 선택 상태 + 경로 [3/5] → 단일 클릭 동작, 3/5 제거
T3-6: 빈 경로 → 현재 selection 그대로 반환
```

### Layer 2: 통합 로직 테스트 (드래그 시나리오)

순수 함수 조합 테스트. 컴포넌트 렌더링 없이 **드래그 시나리오의 상태 흐름**을 검증.

```
T4-1: 드래그 시나리오 시뮬레이션
  - 초기 selectedDates = []
  - 경로: [3/5, 3/6, 3/7] (연속 드래그)
  - toggleDatesSmart([], pathDates) → [3/5, 3/6, 3/7]

T4-2: 비연속 드래그 해제 시나리오
  - 초기 selectedDates = [3/5, 3/6, 3/7, 3/8]
  - 경로: [3/5, 3/7] (비연속 — 6일 건너뜀)
  - toggleDatesSmart([3/5..3/8], [3/5, 3/7]) → [3/6, 3/8]

T4-3: 재진입 방지 (Set 기반)
  - path Set에 같은 timestamp를 두 번 add → size는 1
  - pathSetToDates 결과도 1개만 포함
```

### Layer 3: 컴포넌트 동작 테스트 (선택적 — 구현 후)

ReactDatepickerAdapter의 인터랙션 테스트. jsdom 또는 Playwright 기반.

```
T5-1: 마우스 드래그 → 경로 셀만 선택됨
T5-2: 터치 드래그 → 경로 셀만 선택됨
T5-3: 단일 클릭 → 기존과 동일하게 토글
T5-4: disabled 셀 위 드래그 → 무시됨
T5-5: 캘린더 영역 밖으로 마우스 이탈 → 드래그 종료, 선택 확정
```

## Implementation Phases

### Phase A: 테스트 인프라 설정

1. `vitest.config.ts` 생성 (경로 alias, node 환경)
2. `package.json`에 `"test"` 스크립트 추가 확인

### Phase B: Red — 실패하는 테스트 작성

1. `src/features/host-range-selector/lib/dateUtils.test.ts` 생성
2. Layer 1 테스트 전체 작성 (T1-1 ~ T3-6)
3. Layer 2 테스트 전체 작성 (T4-1 ~ T4-3)
4. `vitest run` → 모든 테스트 **Red** 확인

### Phase C: Green — 최소 구현

1. `dateUtils.ts`에 `normalizeDateTimestamp`, `pathSetToDates` 추가
2. `vitest run` → Layer 1, 2 테스트 **Green** 확인

### Phase D: ReactDatepickerAdapter 리팩토링

1. `dragRef` 타입 변경: `{ isDragging, path: Set<number>, isSelectMode, startTimestamp }`
2. `dragState` 타입 변경: `{ isDragging, path: Set<number>, isSelectMode }`
3. `handleMouseDown` 수정:
   - `path = new Set([normalizeDateTimestamp(date)])`
   - `isSelectMode = !selectedDates.some(d => isSameDay(d, date))`
4. `handleMouseEnter` 수정:
   - `path.add(normalizeDateTimestamp(date))`
   - `setDragState` 업데이트
5. `handleMouseUp` 수정:
   - `pathSetToDates(path)` → `toggleDatesSmart(prev, pathDates)`
6. `handleTouchStart/Move/End` 동일 패턴 적용
7. `renderDayContents` 수정:
   - `isInDragRange` → `isInDragPath = dragState.path.has(normalizeDateTimestamp(date))`
   - 제거 모드 시각적 구분 추가

### Phase E: Refactor & Polish

1. 불필요한 import 제거 (`generateDateRange`는 adapter에서만 제거)
2. 네이밍 정리 (변수명, 타입명)
3. 모든 테스트 재실행 확인

### Phase F: 수동 QA

1. 호스트 날짜 선택 (meet-create-date) — 마우스 드래그
2. 참여자 투표 (participant-register-date) — 터치 드래그
3. 참여자 수정 (participant-edit-date)
4. 단일 클릭 토글 동작 확인
5. 비활성화 날짜 건너뛰기
6. 캘린더 영역 이탈 시 드래그 종료

## Complexity Tracking

> 없음 — Constitution 위반 사항 없음.

## Risks & Mitigations

| Risk                               | Likelihood | Impact | Mitigation                                                      |
| ---------------------------------- | ---------- | ------ | --------------------------------------------------------------- |
| react-datepicker 내부 이벤트 충돌  | Low        | Medium | `onChange={() => {}}` 유지 + stopPropagation 패턴 유지          |
| 빠른 터치 드래그 시 셀 누락        | Low        | Low    | `touchmove`는 높은 빈도로 발생 + 셀 크기 충분                   |
| Set → Date[] 변환 시 timezone 이슈 | Low        | Medium | `startOfDay` 정규화로 일관된 timestamp 보장                     |
| 기존 사용처 regression             | Medium     | High   | `ReactDatepickerAdapter` props 인터페이스 변경 없음 → 자동 호환 |
