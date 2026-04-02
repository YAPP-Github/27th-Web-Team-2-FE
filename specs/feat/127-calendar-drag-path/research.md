# Research: 캘린더 경로 기반 드래그 선택

**Branch**: `feat/#127-calendar-drag-path`
**Date**: 2026-03-29

## Research Task 1: 드래그 상태 모델 변경 — Range vs Path

### Question

현재 `{ start, end }` 범위 기반 드래그를 `{ path: Set<timestamp> }` 경로 기반으로 변경 시, 어떤 데이터 구조가 최적인가?

### Decision

`Set<number>` (timestamp 기반) 사용

### Rationale

- `Set`은 O(1) lookup으로 이미 방문한 셀 확인에 최적
- `number` (timestamp)는 Date 객체보다 비교가 단순하고 `Set`의 키로 직접 사용 가능
- `isSameDay` 대신 `startOfDay(date).getTime()` 으로 정규화하면 일관된 키 생성 가능
- 드래그 중 실시간 렌더링 시 `Set.has(timestamp)`로 O(1) 판별 → 성능 우수

### Alternatives Considered

1. **`Map<number, Date>`**: 불필요한 Date 저장 오버헤드. Path에서 최종 Date[]를 생성할 때만 변환하면 충분
2. **`Date[]` + `findIndex`**: O(n) lookup. 드래그 중 매 셀마다 중복 체크가 필요하므로 비효율
3. **순서 보존 배열 `number[]` + `Set<number>`**: 순서가 필요한 경우 대비이지만, `toggleDatesSmart`는 순서에 의존하지 않고 첫 번째 날짜 기준 모드만 판별하므로 불필요

---

## Research Task 2: 빠른 드래그 시 셀 건너뛰기 문제

### Question

사용자가 매우 빠르게 드래그하면 `mouseenter` 이벤트가 일부 셀에서 발생하지 않을 수 있다. 이를 보간(interpolation)해야 하는가?

### Decision

보간하지 않는다. 이벤트가 발생한 셀만 선택한다.

### Rationale

- 스펙에 명시: "마우스 이벤트가 발생한 셀만 선택됨 (이벤트가 발생하지 않은 셀은 선택되지 않음)"
- 캘린더 셀은 물리적으로 크기 때문에 (40x40px + padding) 일반적인 드래그 속도로는 건너뛰기가 거의 발생하지 않음
- 보간 구현은 복잡도를 크게 높이며 (그리드 좌표 계산, 인접 셀 추론) ROI가 낮음
- 경로 기반 선택의 핵심 UX는 "지나간 곳만 선택"이므로 건너뛰기는 올바른 동작

### Alternatives Considered

1. **선형 보간**: 이전 셀과 현재 셀 사이의 그리드 경로를 계산하여 중간 셀 추가 — 과도한 복잡도
2. **이전 셀 좌표 기반 bresenham 알고리즘**: 정확하지만 캘린더 그리드 레이아웃 의존성이 높음

---

## Research Task 3: 터치 이벤트에서의 경로 추적

### Question

`touchmove`에서 `elementFromPoint`로 셀을 감지하는 기존 방식이 경로 추적에도 적합한가?

### Decision

기존 `elementFromPoint` + `data-date-timestamp` 방식을 그대로 유지

### Rationale

- 이미 검증된 패턴 (`handleTouchMove`에서 안정적으로 동작 중)
- 경로 추적에서도 동일: 새 셀 감지 시 path Set에 추가하면 됨
- `touchmove` 이벤트는 `mousemove`보다 빈번하게 발생하므로 셀 건너뛰기 가능성이 더 낮음
- 기존 `touchHandledRef` 기반 touch/mouse 충돌 방지 로직도 그대로 유지 가능

---

## Research Task 4: Vitest 설정

### Question

프로젝트에 vitest config가 없다. TDD를 위해 어떤 설정이 필요한가?

### Decision

`vitest.config.ts` 신규 생성. 순수 로직 테스트는 node 환경, 컴포넌트 테스트는 jsdom 환경 사용.

### Rationale

- `vitest@^4.0.16`, `@vitest/browser-playwright`, `@vitest/coverage-v8`이 이미 devDependency에 존재
- `dateUtils.ts`의 순수 함수 테스트는 node 환경이면 충분
- 컴포넌트 테스트 (ReactDatepickerAdapter)는 jsdom 또는 browser mode 필요
- 이 피처에서는 순수 로직 테스트만으로 핵심 동작 검증 가능 → jsdom은 필요 시 추가
- `@/*` 경로 alias 해결을 위해 `vite.resolve.alias` 설정 필요

### Alternatives Considered

1. **Storybook addon-vitest**: Storybook 10과 통합되지만, 이 피처는 인터랙션 로직이 핵심이므로 unit test가 더 적합
2. **Browser mode only**: `@vitest/browser-playwright` 사용 가능하지만 설정 복잡도 높고, 순수 로직 테스트에는 과도

---

## Research Task 5: `toggleDatesSmart` 재사용성

### Question

기존 `toggleDatesSmart`가 경로 기반 입력(비연속 Date[])에서도 올바르게 동작하는가?

### Decision

변경 없이 그대로 재사용 가능

### Rationale

- `toggleDatesSmart`는 `newRange: Date[]`를 받아 첫 번째 날짜 기준으로 ADD/REMOVE 모드를 결정
- 입력이 연속 범위든 비연속 경로든 동일하게 동작
- 단, 파라미터명을 `newRange` → `newDates`로 변경하면 의미가 더 명확 (선택적 리팩토링)
- FR-007 (같은 드래그 내 이중 토글 방지)는 `Set` 기반 path 추적으로 자연스럽게 해결됨 — 같은 셀이 path에 한 번만 추가되므로 `toggleDatesSmart`에 중복 날짜가 전달되지 않음

---

## Research Task 6: 드래그 중 시각적 피드백 전환

### Question

현재 범위 기반 하이라이트(`date >= start && date <= end`)를 경로 기반으로 어떻게 변경하는가?

### Decision

`dragState`를 `{ isDragging, path: Set<number>, isSelectMode: boolean }`로 변경하고, 렌더링 시 `path.has(normalizedTimestamp)`로 판별

### Rationale

- `Set.has()`는 O(1)이므로 30~31개 셀 렌더링 시 성능 영향 없음
- `isSelectMode`를 dragState에 포함시키면 드래그 중 "추가 예정" vs "제거 예정" 시각적 구분 가능
- 기존 `isInDragRange` 변수명을 `isInDragPath`로 변경하면 의미 명확

### Visual Feedback Mapping

- `isSelectMode = true` (추가 모드) + `isInDragPath`: `bg-slate-100` (현재와 동일)
- `isSelectMode = false` (제거 모드) + `isInDragPath`: 선택 해제 예정 표시 (기존 `bg-gray-800`에서 `bg-slate-300`으로 전환 등)
