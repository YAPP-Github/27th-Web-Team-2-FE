# Feature Specification: Number Stepper (웨딘 공통 컴포넌트)

**Feature Branch**: `feat/#99-number-stepper`
**Created**: 2026-02-14
**Status**: Draft
**Input**: User description: "웨딘에만 사용할 공통컴포넌트 구현 - Number Stepper. +, - 클릭에 따라 가운데의 숫자가 올라가거나 내려가야함. 최소 1이어야 함. 사용되는 +, - 아이콘은 아이콘파일로 관리."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - 숫자 증가 (Priority: P1)

사용자가 Number Stepper 컴포넌트의 + 버튼을 클릭하여 수량을 1씩 증가시킨다.

**Why this priority**: 수량 조절의 가장 기본적인 기능으로, 이 컴포넌트의 핵심 가치를 전달한다.

**Independent Test**: + 버튼을 클릭하여 화면에 표시된 숫자가 1씩 증가하는 것을 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** Number Stepper가 초기값 1로 표시되어 있을 때, **When** 사용자가 + 버튼을 클릭하면, **Then** 가운데 숫자가 2로 증가한다.
2. **Given** Number Stepper가 값 5를 표시하고 있을 때, **When** 사용자가 + 버튼을 3번 클릭하면, **Then** 가운데 숫자가 8로 증가한다.

---

### User Story 2 - 숫자 감소 (Priority: P1)

사용자가 Number Stepper 컴포넌트의 - 버튼을 클릭하여 수량을 1씩 감소시킨다.

**Why this priority**: 수량 조절의 기본 기능으로, 증가와 함께 필수적인 핵심 기능이다.

**Independent Test**: - 버튼을 클릭하여 화면에 표시된 숫자가 1씩 감소하는 것을 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** Number Stepper가 값 3을 표시하고 있을 때, **When** 사용자가 - 버튼을 클릭하면, **Then** 가운데 숫자가 2로 감소한다.
2. **Given** Number Stepper가 최소값 1을 표시하고 있을 때, **When** 사용자가 - 버튼을 클릭하면, **Then** 숫자는 1로 유지되고 더 이상 감소하지 않는다.

---

### User Story 3 - 시각적 상태 피드백 (Priority: P2)

사용자가 Number Stepper를 조작할 때, 컴포넌트가 현재 상태(기본/포커스)에 따라 시각적 피드백을 제공한다.

**Why this priority**: 사용성을 높이는 시각적 피드백으로, 핵심 기능은 아니지만 사용자 경험에 중요하다.

**Independent Test**: 컴포넌트를 기본 상태와 포커스 상태에서 확인하여 시각적 차이가 있는지 확인할 수 있다.

**Acceptance Scenarios**:

1. **Given** Number Stepper가 기본 상태일 때, **When** 사용자가 컴포넌트를 확인하면, **Then** 연한 테두리(#E5DEDE)와 배경(#FAF8F8)이 표시된다.
2. **Given** Number Stepper가 포커스 상태일 때, **When** 사용자가 컴포넌트를 확인하면, **Then** 진한 테두리(#393434)가 표시된다.

---

### Edge Cases

- 최소값(1)에서 - 버튼을 클릭하면 값이 1 미만으로 내려가지 않아야 한다.
- 기본적으로 최대값 제한이 없으며, 사용처에서 필요 시 prop으로 최대값을 설정할 수 있다.
- 빠르게 연속 클릭해도 정확한 값이 표시되어야 한다.
- 직접 입력 시 빈 값 상태에서 포커스를 잃으면 최소값(1)으로 자동 복원된다.
- 직접 입력 시 숫자가 아닌 문자는 무시된다.
- 직접 입력 시 최소값 미만의 값을 입력하면 최소값으로 보정된다.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: 컴포넌트는 가운데에 현재 숫자를 표시해야 한다 (초기값: 1)
- **FR-002**: + 버튼 클릭 시 현재 값이 1씩 증가해야 한다
- **FR-003**: - 버튼 클릭 시 현재 값이 1씩 감소해야 한다
- **FR-004**: 값은 최소 1 미만으로 내려갈 수 없어야 한다
- **FR-005**: 값이 최소값(1)일 때 - 버튼은 비활성 상태를 시각적으로 표시해야 한다
- **FR-006**: +, - 아이콘은 별도의 아이콘 파일로 관리되어야 한다
- **FR-007**: 컴포넌트는 기본(Default) 상태와 포커스(Focused) 상태 두 가지 시각적 상태를 지원해야 한다
- **FR-008**: 이 컴포넌트는 웨딘(weddin) 서비스에서만 사용되는 공통 컴포넌트로 관리되어야 한다
- **FR-009**: 값이 변경될 때마다 변경된 값을 부모에게 전달하는 콜백을 지원해야 한다
- **FR-010**: 사용자가 중앙 숫자 영역을 클릭하여 직접 숫자를 타이핑 입력할 수 있어야 한다
- **FR-011**: 직접 입력 시 최소값(1) 미만의 값은 자동으로 최소값으로 보정되어야 한다
- **FR-012**: 직접 입력 시 숫자가 아닌 문자는 입력되지 않아야 한다
- **FR-013**: 빈 값 상태에서 포커스를 잃으면 자동으로 최소값(1)으로 복원되어야 한다

### Design Specifications

- **컴포넌트 크기**: 121px x 36px
- **모서리 둥글기**: 8px
- **내부 여백**: 좌우 10px, 상하 4px
- **요소 간격**: 10px
- **아이콘 크기**: 20px x 20px
- **숫자 표시 영역**: 41px x 28px, 모서리 둥글기 4px, 흰색 배경
- **폰트**: Pretendard GOV, Medium(500), 14px, 줄높이 20px, 자간 -0.28px
- **기본 상태**: 배경 #FAF8F8, 테두리 #E5DEDE (1px)
- **포커스 상태**: 테두리 #393434 (1px)
- **아이콘 기본 색상**: #B6B0B0 (비활성), #5B5554 (활성)
- **아이콘 포커스 색상**: #393434 (선택됨)
- **텍스트 색상**: #5B5554

### Key Entities

- **NumberStepper**: 숫자 증감 컨트롤 컴포넌트. 현재 값, 최소값, 상태(기본/포커스)를 가진다.
- **StepperIcon (Plus/Minus)**: +/- 아이콘. 기본(Default)과 선택(Selected) 두 가지 상태를 가지며, 별도 아이콘 파일로 관리된다.

## Assumptions

- 초기값은 항상 1이며, 외부에서 변경할 수 없다.
- 증감 단위(step)는 1이다.
- 컴포넌트는 웨딘 서비스 내에서 재사용 가능한 공통 컴포넌트로 배치한다.
- 아이콘은 SVG 형식으로 별도 관리한다.
- 최소값이 1이므로, 값이 1일 때 - 버튼/아이콘은 비활성(Default) 상태로 표시된다.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 사용자가 + 버튼을 클릭할 때마다 표시 숫자가 정확히 1씩 증가한다.
- **SC-002**: 사용자가 - 버튼을 클릭할 때마다 표시 숫자가 정확히 1씩 감소하되, 최소값 1 아래로는 내려가지 않는다.
- **SC-003**: 컴포넌트가 디자인 시스템 명세(크기, 색상, 폰트, 간격)와 100% 일치하게 렌더링된다.
- **SC-004**: 웨딘 서비스 내 수량 선택이 필요한 모든 화면에서 이 컴포넌트를 재사용할 수 있다.

## Clarifications

### Session 2026-02-14

- Q: Number Stepper에 최대값 제한이 필요한가요? → A: 최대값 없음. 사용처에서 필요 시 prop으로 제한 가능.
- Q: Number Stepper의 초기값을 외부에서 설정할 수 있어야 하나요? → A: 아니오, 항상 1부터 시작.
- Q: 값이 변경될 때 부모 컴포넌트에 콜백(onChange) 동작이 필요한가요? → A: 예, onChange 콜백 필요.
- Q: 사용자가 직접 숫자를 입력(타이핑)할 수 있어야 하나요? → A: 예, 직접 입력 가능.
- Q: 직접 입력 시 빈 값에서 포커스를 잃으면 어떻게 처리? → A: 최소값(1)으로 자동 복원.

## Figma References

- [Number Stepper Component](https://www.figma.com/design/fzfBdfbxvfYvIHuS6gTg02/weddin-Design-system?node-id=2087-749)
- [Plus Icon](https://www.figma.com/design/fzfBdfbxvfYvIHuS6gTg02/weddin-Design-system?node-id=2085-2443)
- [Minus Icon](https://www.figma.com/design/fzfBdfbxvfYvIHuS6gTg02/weddin-Design-system?node-id=2085-2446)
