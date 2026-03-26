# Implementation Plan: 날짜 연속 클릭 시 선택 상태 롤백/미입력 버그 수정

**Branch**: `feat/#118-date-click-race-fix` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/feat/118-date-click-race-fix/spec.md`

## Summary

날짜를 빠르게 연속 클릭할 때 `dragRef`(useRef)와 `dragState`(useState)의 이중 상태 관리에서 발생하는 동기화 불일치를 수정한다. 핵심은 `handleMouseUp`에서 `onChange` 호출 시 `selectedDates` prop의 stale closure 문제로, 빠른 연속 클릭 시 이전 클릭의 결과가 반영되기 전에 다음 클릭이 처리되어 상태가 롤백된다.

## Technical Context

**Language/Version**: TypeScript 5
**Primary Dependencies**: React 19, Next.js 16 (App Router), react-datepicker, date-fns
**Storage**: N/A (클라이언트 상태만 관련)
**Testing**: Vitest + Playwright
**Target Platform**: Web (모바일 터치 + 데스크톱 마우스)
**Project Type**: Monorepo (`apps/moit`)
**Performance Goals**: 0.1초 간격 연속 클릭에서 100% 정확한 선택 반영
**Constraints**: 기존 API 계약 변경 없음, react-datepicker 라이브러리 제약 내에서 해결
**Scale/Scope**: 3개 파일 수정 (ReactDatepickerAdapter, useDateSelection, dateUtils)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Gate                 | Status  | Notes                                                                            |
| -------------------- | ------- | -------------------------------------------------------------------------------- |
| FSD 레이어 준수      | ✅ PASS | 수정 대상이 모두 `features/host-range-selector` 내부. 레이어 간 의존성 변경 없음 |
| 배럴 패턴 금지       | ✅ PASS | 배럴 패턴 사용하지 않음                                                          |
| 단방향 의존성        | ✅ PASS | `lib → model → ui` 방향 유지                                                     |
| function declaration | ✅ PASS | 기존 `ReactDatepickerAdapter`가 function declaration 사용 중                     |
| 코드 스타일          | ✅ PASS | camelCase, handle 접두사 등 기존 규칙 준수                                       |

## Root Cause Analysis

### 문제의 핵심 메커니즘

`ReactDatepickerAdapter`에서 단일 날짜 클릭 플로우:

```
1. handleMouseDown(date) → dragRef = {isDragging: true, start: date, end: date}
2. handleMouseUp()       → toggleDatesSmart(selectedDates, [date]) → onChange(newSelection)
```

**Race Condition**: `onChange`는 부모의 `handleDateChange`를 호출하여 `setSelectedDates`를 실행하지만, React의 비동기 상태 업데이트로 인해 `selectedDates` prop이 즉시 갱신되지 않는다. 두 번째 클릭의 `handleMouseUp`이 실행될 때 `selectedDates`는 아직 첫 번째 클릭 이전의 값을 참조하여 `toggleDatesSmart`가 잘못된 기반 상태로 계산한다.

```
시간순서:
t0: selectedDates = [A]
t1: 클릭 B → toggleDatesSmart([A], [B]) → onChange([A, B])  ← 정상
t2: 클릭 C → toggleDatesSmart([A], [C]) → onChange([A, C])  ← 버그! selectedDates가 아직 [A]
    (selectedDates가 [A, B]로 업데이트되기 전에 실행됨)
```

### 추가 문제

1. **드래그 중 상태 불일치**: `dragRef`는 동기 업데이트, `dragState`는 비동기 업데이트로 시각적 피드백과 실제 상태 불일치
2. **투표 제출 시 stale state**: `formattedDates`가 `useMemo`로 계산되므로, 마지막 `setSelectedDates` 이후 렌더가 완료되기 전에 제출하면 이전 상태 전송 가능

## Phase 0 — Research

### 연구 항목 1: React 19 상태 업데이트 배칭 동작

**결론**: React 18+에서는 모든 이벤트 핸들러(마우스, 터치 포함)에서 자동 배칭이 적용된다. `setDragState`와 부모의 `setSelectedDates`가 동일 이벤트 루프에서 배칭될 수 있다. 그러나 **별도의 이벤트**(mousedown → mouseup)에서 호출되므로, 각 이벤트는 독립적으로 배칭된다. 문제는 두 번째 클릭의 mouseup이 첫 번째 클릭의 상태 업데이트가 flush되기 전에 실행되는 것.

**해결 방향**: `selectedDates`를 클로저로 캡처하지 않고, `useRef`로 최신 상태를 동기적으로 추적하거나, 상태 업데이트를 updater function 패턴(`setState(prev => ...)`)으로 전환.

### 연구 항목 2: useRef vs useState 이중 상태 패턴의 대안

**결론**: 드래그 UI 피드백을 위해 `dragState`(useState)가 필요하지만, 실제 로직은 `dragRef`(useRef)만 사용하면 된다. 현재 구조에서는 **onChange 콜백에 전달되는 `selectedDates`의 staleness**가 핵심 문제이므로, 가장 간단한 수정은:

1. `useDateSelection` 훅에서 `selectedDatesRef`를 추가하여 최신 상태를 동기적으로 유지
2. `ReactDatepickerAdapter`에서 `onChange` 호출 시 최신 selectedDates 기반으로 계산

또는:

3. `onChange` 콜백을 `(prevDates: Date[]) => Date[]` updater 패턴으로 변경하여, 항상 최신 상태 기반으로 토글 계산

**선택**: 옵션 3 (updater 패턴) — 가장 React-idiomatic하고, 상태 동기화 문제를 근본적으로 해결.

## Phase 1 — Design & Contracts

### Architecture Decision Table

| Decision             | Options                                                                                            | Chosen                | Rationale                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------- |
| 상태 동기화 전략     | (A) selectedDatesRef 추가 (B) updater 패턴 (C) 전체 재설계                                         | **(B) updater 패턴**  | React-idiomatic, 최소 변경, 기존 인터페이스 대부분 유지          |
| 드래그 상태 관리     | (A) 현재 유지 (dual ref+state) (B) ref만 사용 + forceUpdate (C) ref만 사용 + requestAnimationFrame | **(A) 현재 유지**     | 드래그 시각적 피드백에 useState 필요, 이 부분은 버그 원인이 아님 |
| 투표 제출 stale 방지 | (A) useRef로 최신 dates 추적 (B) 제출 시 flushSync (C) useRef + formattedDates 동기화              | **(A) useRef로 추적** | flushSync는 성능 영향, useRef가 안전하고 단순                    |

### 수정 대상 파일 및 변경 사항

#### 1. `src/features/host-range-selector/ui/ReactDatepickerAdapter.tsx`

**변경**: `handleMouseUp`에서 `onChange`를 updater 패턴으로 호출

```
현재: onChange(toggleDatesSmart(selectedDates, newRange))
변경: onChange(prevDates => toggleDatesSmart(prevDates, newRange))
```

- `onChange` prop 타입을 `(dates: Date[]) => void`에서 `(updater: Date[] | ((prev: Date[]) => Date[])) => void`로 확장
- `handleMouseUp` 내부에서 `selectedDates` closure 참조 제거

#### 2. `src/features/host-range-selector/model/useDateSelection.ts`

**변경**: `handleDateChange`가 updater function도 받을 수 있도록 확장

```typescript
const handleDateChange = useCallback(
  (newDatesOrUpdater: Date[] | ((prev: Date[]) => Date[])) => {
    if (typeof newDatesOrUpdater === 'function') {
      setSelectedDates((prev) => {
        const result = newDatesOrUpdater(prev);
        return [...result].sort((a, b) => a.getTime() - b.getTime());
      });
    } else {
      const sortedDates = [...newDatesOrUpdater].sort(
        (a, b) => a.getTime() - b.getTime(),
      );
      setSelectedDates(sortedDates);
    }
  },
  [],
);
```

**추가**: 투표 제출 stale 방지를 위한 `selectedDatesRef` 추가

```typescript
const selectedDatesRef = useRef<Date[]>(selectedDates);
useEffect(() => {
  selectedDatesRef.current = selectedDates;
}, [selectedDates]);
```

`formattedDatesRef`도 추가하여 제출 시 항상 최신 상태 참조 가능.

#### 3. `src/features/host-range-selector/model/types.ts`

**변경**: `HostRangeSelectorProps.onChange` 타입 업데이트

```typescript
onChange: (dates: Date[] | ((prev: Date[]) => Date[])) => void;
```

#### 4. 영향 받는 소비자 (변경 불필요 확인)

- `useParticipantRegisterDate.ts` — `onDateClick`에서 `handleDateChange(dates)` 호출. `Date[]` 직접 전달이므로 기존 시그니처 호환.
- `useParticipantEditDate.ts` — 동일.
- `useDateSelect.ts` (호스트) — `useDateSelection`을 사용하지 않고 자체 `selectedDates: string[]` 관리. 영향 없음.

### 데이터 모델

변경 없음. 기존 `Date[]` 상태와 `voteDates: string[]` API 계약 유지.

### API 계약

변경 없음. 클라이언트 상태 관리 버그 수정이므로 API 호출 패턴 변경 없음.

## Project Structure

### Documentation (this feature)

```text
specs/feat/118-date-click-race-fix/
├── plan.md              # This file
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (수정 대상)

```text
src/features/host-range-selector/
├── lib/
│   └── dateUtils.ts             # 변경 없음 (toggleDatesSmart 로직 자체는 정상)
├── model/
│   ├── types.ts                 # onChange 타입 확장
│   └── useDateSelection.ts     # updater 패턴 지원 + selectedDatesRef 추가
└── ui/
    └── ReactDatepickerAdapter.tsx  # handleMouseUp에서 updater 패턴 사용
```

### 영향 범위 (변경 불필요, 호환성 확인만)

```text
src/features/participant-register-date/model/useParticipantRegisterDate.ts
src/features/participant-edit-date/model/useParticipantEditDate.ts
src/features/meet-create-date/ui/DateSelectPage.tsx
```
