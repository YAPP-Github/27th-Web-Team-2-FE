# Data Model: 캘린더 경로 기반 드래그 선택

**Branch**: `feat/#127-calendar-drag-path`
**Date**: 2026-03-29

## 변경 대상 타입/상태 모델

### 1. DragRef (동기적 mutable ref — 이벤트 핸들러용)

**Before (Range 기반)**:

```typescript
{
  isDragging: boolean;
  start: Date | null;
  end: Date | null;
}
```

**After (Path 기반)**:

```typescript
{
  isDragging: boolean;
  path: Set<number>; // startOfDay timestamp 집합
  isSelectMode: boolean; // true = 선택 모드, false = 해제 모드
  startTimestamp: number | null; // 드래그 시작 셀 (toggleDatesSmart 첫 번째 인자용)
}
```

### 2. DragState (React state — 렌더링용)

**Before**:

```typescript
{
  isDragging: boolean;
  start: Date | null;
  end: Date | null;
}
```

**After**:

```typescript
{
  isDragging: boolean;
  path: Set<number>; // 렌더링 시 하이라이트할 셀 판별
  isSelectMode: boolean; // 추가/제거 모드에 따른 시각적 구분
}
```

### 3. 기존 유지 타입 (변경 없음)

```typescript
// HostRangeSelectorProps — 변경 없음
interface HostRangeSelectorProps {
  selectedDates: Date[];
  onChange: (updater: (prev: Date[]) => Date[]) => void;
  availableDates?: Date[];
}

// useDateSelection 반환값 — 변경 없음
// toggleDatesSmart 시그니처 — 변경 없음 (입력이 비연속 Date[]여도 동작)
```

## 헬퍼 함수 시그니처

### 신규: `normalizeDateTimestamp`

```typescript
/** Date를 startOfDay timestamp(number)로 정규화 */
function normalizeDateTimestamp(date: Date): number;
```

### 신규: `pathSetToDates`

```typescript
/** Set<number>(timestamp)를 정렬된 Date[]로 변환 */
function pathSetToDates(path: Set<number>): Date[];
```

### 기존 유지: `toggleDatesSmart`

```typescript
/** 입력 Date[]가 연속이든 비연속이든 동일 동작 */
function toggleDatesSmart(currentSelection: Date[], newDates: Date[]): Date[];
```

### 기존 유지 (드래그에서는 미사용): `generateDateRange`

```typescript
/** 연속 범위 생성 — 다른 곳에서 사용할 가능성 대비 유지 */
function generateDateRange(start: Date, end: Date): Date[];
```

## API 계약 변경

**없음** — 이 피처는 순수 클라이언트 인터랙션 변경이며, API 요청 페이로드 (`voteDates: string[]`)는 동일하게 유지됨.
