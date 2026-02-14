# Implementation Plan: Number Stepper

**Branch**: `feat/#99-number-stepper` | **Date**: 2026-02-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/feat/099-number-stepper/spec.md`

## Summary

웨딘 전용 Number Stepper 공통 컴포넌트를 구현한다. +/- 버튼으로 숫자를 증감하고, 직접 입력도 지원하며, 최소값은 1이다. +/- 아이콘은 `packages/shared/assets/icons/`에 React 컴포넌트로 추가하고, NumberStepper 컴포넌트는 `apps/weddin/src/shared/ui/number-stepper/`에 배치한다.

## Technical Context

**Language/Version**: TypeScript 5
**Primary Dependencies**: React 19, Next.js 16 (App Router), Tailwind CSS 4 + CVA + clsx + tailwind-merge
**Storage**: N/A (순수 UI 컴포넌트, 서버 데이터 없음)
**Testing**: Vitest (단위 테스트) + Storybook 10 (시각 검증)
**Target Platform**: Web (모바일 반응형)
**Project Type**: Monorepo (npm workspaces) - `apps/weddin` + `packages/shared`
**Performance Goals**: 60fps 상호작용, 즉각 반응
**Constraints**: 연속 클릭 시 정확한 값 유지
**Scale/Scope**: 단일 UI 컴포넌트 + 2개 아이콘 컴포넌트

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Gate                 | Status | Notes                                                    |
| -------------------- | ------ | -------------------------------------------------------- |
| FSD 레이어 준수      | PASS   | `shared/ui/`에 배치 — 도메인 비의존 공용 컴포넌트 레이어 |
| No barrel exports    | PASS   | 개별 파일 직접 import 사용                               |
| 단방향 의존성        | PASS   | `shared`는 상위 레이어를 import하지 않음                 |
| function declaration | PASS   | 모든 컴포넌트를 function declaration으로 작성            |
| 네이밍 컨벤션        | PASS   | PascalCase 컴포넌트, camelCase 훅/유틸                   |

## Project Structure

### Documentation (this feature)

```text
specs/feat/099-number-stepper/
├── plan.md              # 이 파일
├── research.md          # Phase 0 연구 결과
├── data-model.md        # Phase 1 데이터 모델
├── spec.md              # 기능 명세
├── checklists/
│   └── requirements.md  # 품질 체크리스트
└── tasks.md             # Phase 2 (/speckits/tasks에서 생성)
```

### Source Code (repository root)

```text
packages/shared/assets/icons/
├── IcPlus.tsx                    # [NEW] + 아이콘 컴포넌트
├── IcMinus.tsx                   # [NEW] - 아이콘 컴포넌트
└── iconRegistry.ts               # [MODIFY] 새 아이콘 등록

apps/weddin/src/shared/ui/number-stepper/
├── NumberStepper.tsx             # [NEW] 메인 컴포넌트
└── NumberStepper.stories.tsx     # [NEW] Storybook 스토리
```

**Structure Decision**: 웨딘 전용 컴포넌트이므로 `apps/weddin/src/shared/ui/`에 배치. 아이콘은 프로젝트 아이콘 시스템(`packages/shared/assets/icons/`)에 추가하여 `Icon` wrapper를 통해 사용.

## Architecture Decision Table

| Decision      | Options Considered                                     | Chosen | Rationale                                               |
| ------------- | ------------------------------------------------------ | ------ | ------------------------------------------------------- |
| 아이콘 배치   | (A) packages/shared/assets/icons/ (B) weddin 앱 내부   | A      | 기존 아이콘 관리 패턴 일관성, Icon wrapper 재사용       |
| 컴포넌트 배치 | (A) apps/weddin/src/shared/ui/ (B) packages/shared/ui/ | A      | 웨딘 전용 컴포넌트, 앱 레벨 shared가 적합               |
| 상태 관리     | (A) useState 내부 관리 (B) 외부 controlled             | A      | 초기값 고정(1), 내부 관리 + onChange 콜백으로 외부 통신 |
| 입력 방식     | (A) input type="number" (B) input type="text" + 필터링 | B      | 브라우저 기본 number input 스피너 제거, 커스텀 UI 유지  |
| 스타일링      | (A) Tailwind arbitrary values (B) CSS 클래스           | A      | 프로젝트 스타일링 컨벤션 준수, 디자인 토큰 직접 적용    |

## File Details

### 1. `packages/shared/assets/icons/IcPlus.tsx`

- SVG 아이콘 컴포넌트 (Pattern A: Simple SVG)
- `SVGProps<SVGSVGElement>` 수용
- viewBox: `0 0 20 20`
- stroke: `currentColor`, strokeWidth: 1.5, strokeLinecap: round, strokeLinejoin: round
- 십자 모양 (가로선 + 세로선)

### 2. `packages/shared/assets/icons/IcMinus.tsx`

- SVG 아이콘 컴포넌트 (Pattern A: Simple SVG)
- `SVGProps<SVGSVGElement>` 수용
- viewBox: `0 0 20 20`
- stroke: `currentColor`, strokeWidth: 1.5, strokeLinecap: round, strokeLinejoin: round
- 가로선만

### 3. `packages/shared/assets/icons/iconRegistry.ts`

- `IcPlus`, `IcMinus` import 추가
- `icons` 객체에 `ic_plus`, `ic_minus` 등록

### 4. `apps/weddin/src/shared/ui/number-stepper/NumberStepper.tsx`

- Props: `onChange: (value: number) => void`, `max?: number`, `className?: string`
- 내부 상태: `value` (초기 1), `isFocused`
- 구조: `[- icon] [input] [+ icon]`
- Icon은 `@repo/shared/ui/icon/Icon` wrapper 사용, size=20
- 최소값(1)에서 minus 아이콘 색상: `#B6B0B0` (비활성)
- 포커스 시 외곽 테두리 색상 변경: `#E5DEDE` → `#393434`
- input은 type="text", 숫자만 허용 필터링
- blur 시 빈 값이면 1로 복원, min 미만이면 min으로 보정
- function declaration 스타일

### 5. `apps/weddin/src/shared/ui/number-stepper/NumberStepper.stories.tsx`

- Storybook story (`Meta<typeof NumberStepper>`)
- Stories: Default, MinValue, HighValue, WithMaxLimit
- `@storybook/nextjs-vite` 사용

## Complexity Tracking

> 위반 사항 없음. 모든 Constitution gate 통과.
