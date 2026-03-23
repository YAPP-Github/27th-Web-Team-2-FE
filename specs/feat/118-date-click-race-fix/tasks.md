# Tasks: 날짜 연속 클릭 시 선택 상태 롤백/미입력 버그 수정

**Input**: Design documents from `specs/feat/118-date-click-race-fix/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: 테스트 태스크는 명세에 명시적으로 요청되지 않았으므로 포함하지 않음.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Foundational (타입 및 인터페이스 변경)

**Purpose**: onChange 콜백의 타입을 updater 패턴을 지원하도록 확장. 이후 모든 태스크의 기반.

- [x] T001 `HostRangeSelectorProps.onChange` 타입을 updater function도 수용하도록 확장 in `src/features/host-range-selector/model/types.ts` — `onChange: (dates: Date[] | ((prev: Date[]) => Date[])) => void`로 변경

**Checkpoint**: 타입 변경 완료. 기존 소비자들은 `Date[]`를 직접 전달하므로 하위 호환 유지.

---

## Phase 2: User Story 1 - 연속 클릭 시 정확한 선택/해제 보장 (Priority: P1) 🎯 MVP

**Goal**: `useDateSelection` 훅과 `ReactDatepickerAdapter`에서 빠른 연속 클릭 시 stale closure 문제를 해결하여 모든 클릭이 정확히 반영되도록 한다.

**Independent Test**: 캘린더에서 5개 이상의 날짜를 0.5초 이내 간격으로 연속 클릭한 후, 모든 날짜가 정상적으로 선택 상태를 유지하는지 확인.

### Implementation for User Story 1

- [x] T002 [US1] `handleDateChange`를 updater function 패턴도 수용하도록 수정 in `src/features/host-range-selector/model/useDateSelection.ts` — `typeof newDatesOrUpdater === 'function'` 분기 추가, updater 결과도 시간순 정렬 적용
- [x] T003 [US1] `handleMouseUp`에서 `onChange`를 updater 패턴으로 호출하도록 변경 in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx` — `onChange(selectedDates => toggleDatesSmart(selectedDates, newRange))` 형태로 변경하여 stale closure 제거
- [x] T004 [US1] 기존 소비자 호환성 확인 — `src/features/participant-register-date/model/useParticipantRegisterDate.ts`와 `src/features/participant-edit-date/model/useParticipantEditDate.ts`에서 `handleDateChange(dates)` 호출이 `Date[]` 직접 전달이므로 변경 불필요함을 검증 (코드 읽기만, 수정 없음)

**Checkpoint**: 이 시점에서 연속 클릭 시 모든 날짜가 정확히 선택/해제됨. 마우스와 터치 모두 동작.

---

## Phase 3: User Story 2 - 드래그 날짜 범위 선택 정확성 (Priority: P2)

**Goal**: 드래그 인터랙션에서도 updater 패턴이 정상 동작하는지 확인. Phase 2의 `handleMouseUp` 수정이 드래그 시나리오에도 동일하게 적용되므로, 추가 코드 변경은 최소화.

**Independent Test**: 캘린더에서 시작 날짜를 클릭/터치한 후 끝 날짜까지 드래그하여 범위 내 모든 날짜가 정확히 선택되는지 확인.

### Implementation for User Story 2

- [x] T005 [US2] 연속 드래그 시나리오 검증 — `handleMouseUp`의 updater 패턴이 드래그 범위(`generateDateRange` 결과)에도 정상 동작하는지 확인 in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx` (드래그 후 즉시 다른 범위 드래그 시 이전 결과 반영 여부 확인)
- [x] T006 [US2] 터치/마우스 혼합 이벤트 방어 로직 검증 — `touchHandledRef`와 `handleTouchEnd`의 300ms 딜레이가 updater 패턴과 충돌 없는지 확인 in `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx` (코드 읽기 + 필요 시 수정)

**Checkpoint**: 드래그 선택 및 연속 드래그 시나리오가 정확히 동작.

---

## Phase 4: User Story 3 - 날짜 선택 직후 투표 제출 시 최신 상태 보장 (Priority: P2)

**Goal**: 마지막 날짜 선택 직후 투표하기 버튼을 누르면, `formattedDates`가 최신 선택 상태를 포함하도록 보장.

**Independent Test**: 날짜를 선택한 직후(1초 이내) 투표하기 버튼을 눌러, 선택한 모든 날짜가 API 요청에 포함되는지 확인.

### Implementation for User Story 3

- [x] T007 [US3] `useDateSelection`에 `selectedDatesRef` 추가 in `src/features/host-range-selector/model/useDateSelection.ts` — `useRef`로 최신 selectedDates를 동기적으로 추적하고, `formattedDatesRef`도 추가하여 제출 시 최신 상태 참조 가능하도록 함. 반환값에 `selectedDatesRef`와 `formattedDatesRef` 포함.
- [x] T008 [US3] `useParticipantRegisterDate`에서 `formattedDatesRef` 활용 in `src/features/participant-register-date/model/useParticipantRegisterDate.ts` — `handleSubmit` 내 `formattedDates` 대신 `formattedDatesRef.current` 사용하여 stale state 방지
- [x] T009 [P] [US3] `useParticipantEditDate`에서 `formattedDatesRef` 활용 in `src/features/participant-edit-date/model/useParticipantEditDate.ts` — `handleSubmit` 내 `formattedDates` 대신 `formattedDatesRef.current` 사용하여 stale state 방지

**Checkpoint**: 날짜 선택 직후 투표 제출 시 최신 상태가 서버에 정확히 전송됨.

---

## Phase 5: Polish & 검증

**Purpose**: 전체 플로우 통합 검증 및 코드 정리

- [x] T010 TypeScript 타입 체크 통과 확인 — `npx tsc --noEmit` 실행하여 타입 에러 없음 검증
- [x] T011 ESLint/Prettier 통과 확인 — `npm run lint` 실행하여 린트 에러 없음 검증
- [ ] T012 수동 E2E 검증 (사용자 직접 테스트 필요) — 호스트 모임 생성 날짜 선택 + 참여자 투표 날짜 선택에서 연속 클릭/드래그/즉시 제출 시나리오 수동 테스트

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: 의존성 없음 — 즉시 시작 가능
- **Phase 2 (US1)**: Phase 1 완료 후 시작 (타입 변경에 의존)
- **Phase 3 (US2)**: Phase 2 완료 후 시작 (handleMouseUp 수정에 의존)
- **Phase 4 (US3)**: Phase 2 완료 후 시작 (useDateSelection 수정에 의존)
- **Phase 5 (Polish)**: Phase 2~4 완료 후 시작

### User Story Dependencies

- **US1 (P1)**: Phase 1 완료 후 시작 — 핵심 수정, 다른 스토리의 기반
- **US2 (P2)**: US1 완료 후 시작 — US1의 handleMouseUp 수정이 드래그에도 적용됨을 검증
- **US3 (P2)**: US1 완료 후 시작 가능 (US2와 독립적) — ref 추가는 별도 로직

### Parallel Opportunities

- **T008, T009**: 서로 다른 파일이므로 병렬 실행 가능
- **Phase 3 (US2)과 Phase 4 (US3)**: US1 완료 후 병렬 시작 가능

---

## Parallel Example

```bash
# Phase 2 완료 후, US2와 US3를 병렬로 실행 가능:
Agent 1: T005, T006 (US2 - 드래그 검증)
Agent 2: T007, T008, T009 (US3 - ref 추가 및 소비자 수정)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: 타입 확장 (T001)
2. Complete Phase 2: US1 핵심 수정 (T002, T003, T004)
3. **STOP and VALIDATE**: 연속 클릭 시 선택 상태 정확성 검증
4. 이것만으로도 핵심 버그가 해결됨

### Incremental Delivery

1. Phase 1 + Phase 2 → MVP: 연속 클릭 버그 수정 완료
2. Phase 3 추가 → 드래그 시나리오 검증 및 보완
3. Phase 4 추가 → 제출 시 stale state 방지
4. Phase 5 → 전체 검증 및 정리

---

## Notes

- 이 버그 수정은 총 3개 파일의 실제 코드 변경 + 2개 파일의 소비자 수정으로 구성됨
- `dateUtils.ts`의 `toggleDatesSmart` 로직 자체는 정상이므로 수정하지 않음
- API 계약 변경 없음 — 순수 클라이언트 상태 관리 수정
