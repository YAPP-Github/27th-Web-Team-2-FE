# Tasks: Number Stepper (웨딘 공통 컴포넌트)

**Input**: Design documents from `specs/feat/099-number-stepper/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: 테스트 태스크 미포함 (명세에서 명시적 요청 없음)

**Organization**: 태스크는 사용자 스토리별로 그룹화하여 독립적 구현/테스트가 가능하도록 구성

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: 해당 사용자 스토리 (US1, US2, US3)
- 모든 경로는 모노레포 루트 기준 절대 경로

---

## Phase 1: Setup (아이콘 인프라)

**Purpose**: +/- 아이콘 컴포넌트 생성 및 아이콘 레지스트리 등록

- [ ] T001 [P] Create IcPlus icon component in packages/shared/assets/icons/IcPlus.tsx — SVG 컴포넌트, viewBox 0 0 20 20, stroke currentColor, strokeWidth 1.5, strokeLinecap/Join round, 십자 모양 (가로선 + 세로선). function declaration 스타일, SVGProps<SVGSVGElement> 수용. 기존 IcCheckboxChecked.tsx 패턴 참고.
- [ ] T002 [P] Create IcMinus icon component in packages/shared/assets/icons/IcMinus.tsx — SVG 컴포넌트, viewBox 0 0 20 20, stroke currentColor, strokeWidth 1.5, strokeLinecap/Join round, 가로선만. function declaration 스타일, SVGProps<SVGSVGElement> 수용.
- [ ] T003 Register IcPlus and IcMinus in packages/shared/assets/icons/iconRegistry.ts — import 추가, icons 객체에 ic_plus, ic_minus 키로 등록. IconName 타입 자동 확장.

**Checkpoint**: 아이콘 인프라 완료 — `Icon` wrapper로 `ic_plus`, `ic_minus` 사용 가능

---

## Phase 2: User Story 1 & 2 - 숫자 증가/감소 (Priority: P1) MVP

**Goal**: +/- 버튼 클릭으로 숫자를 증감하는 핵심 기능 구현. 초기값 1, 최소값 1 제한.

**Independent Test**: 컴포넌트를 렌더링하여 + 클릭 시 숫자 증가, - 클릭 시 숫자 감소 확인. 최소값 1에서 - 클릭 시 값 유지 확인.

> US1(숫자 증가)과 US2(숫자 감소)는 동일 컴포넌트 내 구현이므로 하나의 Phase로 통합

### Implementation

- [ ] T004 [US1] [US2] Create NumberStepper component in apps/weddin/src/shared/ui/number-stepper/NumberStepper.tsx — 전체 구조 구현:
  - Props: `onChange: (value: number) => void`, `max?: number`, `className?: string`
  - 내부 상태: `value` (초기 1), `isFocused` (초기 false)
  - 레이아웃: `[IcMinus 버튼] [input] [IcPlus 버튼]`
  - Icon은 `@repo/shared/ui/icon/Icon` wrapper 사용, name="ic_minus"/"ic_plus", size=20
  - +/- 버튼 클릭 핸들러: handleIncrement, handleDecrement
  - 최소값 1 제한: value가 1일 때 decrement 무시
  - 최대값 제한: max prop 존재 시 max 초과 increment 무시
  - 값 변경 시 onChange 콜백 호출
  - 최소값일 때 minus 아이콘 색상 #B6B0B0 (비활성), 그 외 #5B5554 (활성)
  - plus 아이콘 색상: 기본 #5B5554, max 도달 시 #B6B0B0
  - input type="text", 숫자만 허용 필터링 (FR-012)
  - 직접 입력 시 min 미만이면 blur 시 min으로 보정 (FR-011)
  - 빈 값 blur 시 최소값(1)으로 복원 (FR-013)
  - function declaration 스타일, 배럴 패턴 금지
  - 디자인 스펙: 121x36px, border-radius 8px, padding 좌우 10px 상하 4px, gap 10px
  - 입력 영역: 41x28px, border-radius 4px, 흰색 배경
  - 폰트: Pretendard GOV Medium 14px, line-height 20px, letter-spacing -0.28px
  - 텍스트 색상: #5B5554, text-align center

**Checkpoint**: US1(숫자 증가) + US2(숫자 감소) 핵심 기능 완료, 독립 테스트 가능

---

## Phase 3: User Story 3 - 시각적 상태 피드백 (Priority: P2)

**Goal**: 기본(Default)과 포커스(Focused) 상태에 따른 시각적 피드백 구현

**Independent Test**: 컴포넌트의 기본 상태에서 연한 테두리(#E5DEDE) + 배경(#FAF8F8) 확인, 포커스 상태에서 진한 테두리(#393434) 확인

### Implementation

- [ ] T005 [US3] Add visual state feedback to NumberStepper in apps/weddin/src/shared/ui/number-stepper/NumberStepper.tsx — 기본/포커스 상태 시각적 분기:
  - 기본 상태: 배경 #FAF8F8, 테두리 #E5DEDE (1px solid)
  - 포커스 상태 (isFocused=true): 테두리 #393434 (1px solid)
  - input onFocus/onBlur로 isFocused 상태 토글
  - 아이콘 포커스 색상: 포커스 시 활성 아이콘 #393434 (선택됨)
  - Tailwind arbitrary values 사용: `bg-[#FAF8F8]`, `border-[#E5DEDE]`, `focus:border-[#393434]` 등

**Checkpoint**: 모든 User Story 완료 — 기능 + 시각 피드백 동작

---

## Phase 4: Polish & Storybook

**Purpose**: Storybook 문서화 및 최종 검수

- [ ] T006 Create Storybook stories in apps/weddin/src/shared/ui/number-stepper/NumberStepper.stories.tsx — `@storybook/nextjs-vite` Meta 타입 사용:
  - title: 'Shared/UI/NumberStepper'
  - argTypes: onChange (action), max (number control)
  - Stories:
    - Default: 기본 상태 (초기값 1)
    - MinValue: 최소값(1) 상태에서 minus 비활성 확인
    - HighValue: 높은 값(예: 50) 상태
    - WithMaxLimit: max=10 설정 시 제한 동작 확인
  - decorators: centered layout
  - 기존 Button.stories.tsx 패턴 참고
- [ ] T007 Verify all design spec compliance — 디자인 시스템 명세와 최종 비교 검증 (크기, 색상, 폰트, 간격, 아이콘 크기)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 의존성 없음 — 즉시 시작 가능
- **Phase 2 (US1+US2)**: Phase 1 완료 필요 (아이콘 레지스트리 등록 후 컴포넌트에서 사용)
- **Phase 3 (US3)**: Phase 2 완료 필요 (기본 컴포넌트 존재해야 시각 상태 추가 가능)
- **Phase 4 (Polish)**: Phase 3 완료 필요 (모든 기능 완료 후 Storybook 작성)

### User Story Dependencies

- **US1 + US2 (P1)**: Phase 1 완료 후 시작 — 동일 컴포넌트에서 구현되므로 통합
- **US3 (P2)**: US1+US2 완료 후 시작 — 기존 컴포넌트에 시각 상태를 추가하는 방식

### Parallel Opportunities

- **Phase 1**: T001(IcPlus)과 T002(IcMinus) 병렬 실행 가능
- **Phase 4**: T006(Storybook)과 T007(검증) 은 순차적으로 진행

---

## Parallel Example: Phase 1

```bash
# T001과 T002를 동시에 실행 (서로 다른 파일):
Task: "Create IcPlus icon in packages/shared/assets/icons/IcPlus.tsx"
Task: "Create IcMinus icon in packages/shared/assets/icons/IcMinus.tsx"

# 완료 후 T003 실행 (레지스트리 등록):
Task: "Register icons in packages/shared/assets/icons/iconRegistry.ts"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Phase 1 완료: 아이콘 생성 + 등록
2. Phase 2 완료: NumberStepper 핵심 기능 (증가/감소/직접입력)
3. **STOP and VALIDATE**: + 클릭 → 증가, - 클릭 → 감소, 최소값 1 제한 확인
4. Storybook으로 시각 확인 가능

### Full Delivery

1. MVP 완료 후 Phase 3: 시각 상태 피드백 추가
2. Phase 4: Storybook 스토리 작성 + 디자인 스펙 최종 검증
3. 커밋 및 PR 준비

---

## Notes

- 모든 컴포넌트는 function declaration 스타일 사용
- 배럴 패턴(index.ts) 금지 — 직접 파일 경로로 import
- US1과 US2는 동일 파일(NumberStepper.tsx)에서 구현되므로 하나의 Phase로 통합
- 아이콘은 packages/shared에, 컴포넌트는 apps/weddin/src/shared에 배치
- 커밋은 Phase 단위로 수행 권장
