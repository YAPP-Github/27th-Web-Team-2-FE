# Tasks: 캘린더 경로 기반 드래그 선택

**Input**: Design documents from `/specs/feat/127-calendar-drag-path/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: TDD 방식 적용 (plan.md에 명시된 Red → Green → Refactor 사이클)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (테스트 인프라)

**Purpose**: Vitest 설정 및 테스트 환경 구축

- [x] T001 Create Vitest configuration file at `src/vitest.config.ts` with path alias (`@/*` → `src/*`) and node environment
- [x] T002 Add `"test"` script to `package.json` (`vitest run`)

---

## Phase 2: Foundational (순수 헬퍼 함수 — TDD)

**Purpose**: 경로 기반 드래그의 핵심 순수 함수를 TDD로 구현. 모든 User Story가 이 함수들에 의존함.

**⚠️ CRITICAL**: User Story 구현 전 이 Phase가 완료되어야 함

### Red — 실패하는 테스트 작성

- [x] T003 Create test file `src/features/host-range-selector/lib/dateUtils.test.ts` with Layer 1 tests: `normalizeDateTimestamp` (T1-1, T1-2), `pathSetToDates` (T2-1 ~ T2-4), `toggleDatesSmart` 경로 입력 (T3-1 ~ T3-6)
- [x] T004 Add Layer 2 integration tests to `src/features/host-range-selector/lib/dateUtils.test.ts`: drag scenario simulation (T4-1 ~ T4-3)
- [x] T005 Run `vitest run` to verify all tests **RED** (fail)

### Green — 최소 구현

- [x] T006 Implement `normalizeDateTimestamp(date: Date): number` in `src/features/host-range-selector/lib/dateUtils.ts` — `startOfDay(date).getTime()` 정규화
- [x] T007 Implement `pathSetToDates(path: Set<number>): Date[]` in `src/features/host-range-selector/lib/dateUtils.ts` — Set을 정렬된 Date[]로 변환
- [x] T008 Run `vitest run` to verify all tests **GREEN** (pass)

**Checkpoint**: 순수 헬퍼 함수 완성 — User Story 구현 가능

---

## Phase 3: User Story 1 — 마우스 드래그로 개별 날짜 경로 선택 (Priority: P1) 🎯 MVP

**Goal**: 마우스 드래그 시 포인터가 지나간 날짜 셀만 선택/해제되도록 `ReactDatepickerAdapter`의 마우스 이벤트 핸들러를 리팩토링

**Independent Test**: 캘린더에서 마우스 드래그 시 경로 위의 셀만 선택되는지, 기존 단일 클릭 토글이 유지되는지 확인

### Implementation for User Story 1

- [x] T009 [US1] Update `dragRef` type in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx`: `{ isDragging: boolean, path: Set<number>, isSelectMode: boolean, startTimestamp: number | null }`
- [x] T010 [US1] Update `dragState` React state in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx`: `{ isDragging: boolean, path: Set<number>, isSelectMode: boolean }`
- [x] T011 [US1] Refactor `handleMouseDown` in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx`: initialize path with `new Set([normalizeDateTimestamp(date)])`, determine `isSelectMode` from first cell's selection state
- [x] T012 [US1] Refactor `handleMouseEnter` in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx`: `path.add(normalizeDateTimestamp(date))`, update dragState
- [x] T013 [US1] Refactor `handleMouseUp` in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx`: convert path via `pathSetToDates()` → `toggleDatesSmart(prev, pathDates)`, reset drag state
- [x] T014 [US1] Verify single click toggle still works (FR-006): mouseDown + mouseUp on same cell without drag should toggle that cell only

**Checkpoint**: 마우스 드래그 경로 선택 완료 — 4개 사용 화면(meet-create-date, participant-register-date, participant-edit-date, host-range-selector)에서 자동 적용

---

## Phase 4: User Story 2 — 터치 드래그로 개별 날짜 경로 선택 (Priority: P1)

**Goal**: 터치 드래그에서도 동일한 경로 기반 선택이 동작하도록 터치 이벤트 핸들러를 리팩토링

**Independent Test**: 모바일 기기에서 터치 드래그로 날짜를 선택했을 때 경로 위의 셀만 선택/해제되는지 확인

### Implementation for User Story 2

- [x] T015 [US2] Refactor `handleTouchStart` in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx`: initialize path Set with first touch cell, determine isSelectMode (same pattern as handleMouseDown)
- [x] T016 [US2] Refactor `handleTouchMove` in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx`: use `elementFromPoint` + `data-date-timestamp` to detect cell, `path.add(normalizeDateTimestamp(date))`, update dragState
- [x] T017 [US2] Refactor `handleTouchEnd` in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx`: convert path via `pathSetToDates()` → `toggleDatesSmart(prev, pathDates)`, reset drag state (same pattern as handleMouseUp)

**Checkpoint**: 터치 + 마우스 모두 경로 기반 선택 완료

---

## Phase 5: User Story 3 — 드래그 중 시각적 피드백 (Priority: P2)

**Goal**: 드래그 중 마우스/터치가 지나간 셀에 실시간 시각적 피드백 표시 (추가 모드 vs 제거 모드 구분)

**Independent Test**: 드래그 중 경로 셀에 하이라이트가 즉시 표시되는지, 추가/제거 모드에 따라 스타일이 다른지 확인

### Implementation for User Story 3

- [x] T018 [US3] Update `renderDayContents` in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx`: replace `isInDragRange` logic with `isInDragPath = dragState.path.has(normalizeDateTimestamp(date))`
- [x] T019 [US3] Add visual differentiation for select/deselect mode in `renderDayContents`: select mode → `bg-slate-100` (existing), deselect mode → `bg-slate-300` (new visual cue)
- [x] T020 [US3] Ensure drag state resets on mouseUp/touchEnd clear visual feedback (path cleared, isDragging false)

**Checkpoint**: 시각적 피드백 포함한 전체 드래그 경로 선택 완료

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 리팩토링, 엣지 케이스, 최종 검증

- [x] T021 [P] Handle edge case: drag leaves calendar area → end drag and confirm selection in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx` (mouseleave/touchcancel 이벤트)
- [x] T022 [P] Handle edge case: disabled dates in drag path → skip in handleMouseEnter/handleTouchMove (FR-005)
- [x] T023 Remove unused `generateDateRange` import from `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx` (keep function in dateUtils.ts)
- [x] T024 Clean up variable naming: rename `isInDragRange` → `isInDragPath`, `newRange` → `newDates` (선택적 리팩토링)
- [x] T025 Run all tests (`vitest run`) and verify GREEN
- [ ] T026 Manual QA: 4개 캘린더 사용 화면에서 마우스/터치 드래그, 단일 클릭 토글, 비활성 날짜, 영역 이탈 시나리오 확인

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 completion
- **US2 (Phase 4)**: Depends on Phase 3 completion (same file, shared dragRef/dragState types)
- **US3 (Phase 5)**: Depends on Phase 3 completion (renderDayContents uses dragState)
- **Polish (Phase 6)**: Depends on Phase 3, 4, 5 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — core mouse drag path logic
- **User Story 2 (P1)**: Depends on US1 — reuses same dragRef/dragState types defined in US1
- **User Story 3 (P2)**: Depends on US1 — renderDayContents relies on new dragState shape from US1
- **US2 and US3**: Can run in parallel after US1 is complete (US2 touches touch handlers, US3 touches renderDayContents)

### Within Each User Story

- Tests (Phase 2) MUST be written and FAIL before implementation
- Helper functions (Phase 2) before UI refactoring (Phase 3+)
- Mouse handlers (US1) before touch handlers (US2) — shared types
- Core logic before visual feedback (US3)

### Parallel Opportunities

- T001 and T002 (Setup) can run in parallel
- T003 and T004 (test writing) can run in parallel
- T006 and T007 (helper implementation) can run in parallel
- T015, T016, T017 (US2) and T018, T019, T020 (US3) can run in parallel after US1 complete
- T021 and T022 (Polish edge cases) can run in parallel

---

## Parallel Example: After US1 Complete

```bash
# US2 (touch handlers) and US3 (visual feedback) can run in parallel:
# Agent A:
Task: "T015 [US2] Refactor handleTouchStart"
Task: "T016 [US2] Refactor handleTouchMove"
Task: "T017 [US2] Refactor handleTouchEnd"

# Agent B:
Task: "T018 [US3] Update renderDayContents isInDragPath"
Task: "T019 [US3] Add visual differentiation"
Task: "T020 [US3] Ensure drag state resets"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (Vitest 설정)
2. Complete Phase 2: Foundational (TDD — Red → Green)
3. Complete Phase 3: User Story 1 (마우스 드래그 경로 선택)
4. **STOP and VALIDATE**: 마우스 드래그로 비연속 날짜 선택 가능한지 확인
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → 테스트 인프라 + 순수 함수 완성
2. User Story 1 → 마우스 드래그 경로 선택 → Test → Deploy (MVP!)
3. User Story 2 → 터치 드래그 경로 선택 → Test → Deploy
4. User Story 3 → 시각적 피드백 → Test → Deploy
5. Polish → 엣지 케이스 + 정리 → Final Deploy

### Single File Constraint

이 피처는 주요 변경이 `ReactDatepickerAdapter.tsx` 단일 파일에 집중되므로, US1 → US2 → US3 순차 실행이 가장 안전. US2와 US3는 서로 다른 함수를 수정하므로 병렬 가능하나, 같은 파일이므로 병합 충돌 주의.

---

## Notes

- 모든 변경은 `src/features/host-range-selector/` 내부에 한정됨
- `ReactDatepickerAdapter`를 import하는 4개 화면에 자동 전파됨 (props 인터페이스 변경 없음)
- `generateDateRange`는 dateUtils.ts에 유지 (다른 곳 재사용 가능성)
- 총 26개 태스크 / US1: 6개, US2: 3개, US3: 3개, Setup: 2개, Foundation: 6개, Polish: 6개
