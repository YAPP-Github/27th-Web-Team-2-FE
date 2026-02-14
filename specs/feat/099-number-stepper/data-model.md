# Data Model: Number Stepper

**Date**: 2026-02-14
**Feature**: Number Stepper (웨딘 공통 컴포넌트)

## Entities

이 기능은 순수 UI 컴포넌트로, API 호출이나 서버 데이터 모델이 없다.

### NumberStepper (UI Component Props)

| 속성      | 타입                      | 필수 | 기본값      | 설명                              |
| --------- | ------------------------- | ---- | ----------- | --------------------------------- |
| onChange  | `(value: number) => void` | Y    | -           | 값 변경 시 호출되는 콜백          |
| max       | `number`                  | N    | `undefined` | 최대값 제한 (미설정 시 제한 없음) |
| className | `string`                  | N    | `undefined` | 추가 CSS 클래스                   |

### 내부 상태

| 상태      | 타입      | 초기값  | 설명                             |
| --------- | --------- | ------- | -------------------------------- |
| value     | `number`  | `1`     | 현재 표시 숫자 (항상 1부터 시작) |
| isFocused | `boolean` | `false` | 입력 영역 포커스 여부            |

### StepperIcon (Plus/Minus)

| 속성   | 타입                         | 설명                                                          |
| ------ | ---------------------------- | ------------------------------------------------------------- |
| 상태   | `default` / `selected`       | 아이콘 색상 변경 (비활성 #B6B0B0, 활성 #5B5554, 선택 #393434) |
| 크기   | 20x20px                      | 고정 크기                                                     |
| stroke | 1.5px, round cap, round join | SVG 선 속성                                                   |

## Relationships

```
NumberStepper
├── IcMinus (icon component, packages/shared)
├── Input field (내부 숫자 표시/입력)
└── IcPlus (icon component, packages/shared)
```
