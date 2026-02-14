# Research: Number Stepper

**Date**: 2026-02-14
**Feature**: Number Stepper (웨딘 공통 컴포넌트)

## Research Questions

### RQ-1: 아이콘 관리 방식

**Question**: +/- 아이콘을 어디에, 어떤 방식으로 관리할 것인가?

**Findings**:

- 프로젝트는 `packages/shared/assets/icons/`에 React TSX 컴포넌트로 아이콘을 관리
- `iconRegistry.ts`에 중앙 등록, `Icon.tsx` wrapper로 통합 사용
- SVGR 미사용, 수동 React 컴포넌트 방식
- 아이콘 패턴 A (Simple SVG): `SVGProps<SVGSVGElement>` 수용, `currentColor` 사용, `viewBox='0 0 20 20'`

**Decision**: 기존 패턴을 따라 `packages/shared/assets/icons/`에 `IcPlus.tsx`, `IcMinus.tsx` 생성 후 `iconRegistry.ts`에 등록

**Rationale**: 프로젝트 전체의 아이콘 관리 일관성 유지. 모노레포 공유 패키지에서 관리하므로 moit/weddin 모두 사용 가능.

**Alternatives considered**:

- weddin 앱 내부에 아이콘 관리 → 기존 패턴과 불일치, Icon wrapper 재사용 불가

### RQ-2: 컴포넌트 배치 위치

**Question**: NumberStepper를 FSD 어느 레이어에 배치할 것인가?

**Findings**:

- 웨딘 전용 공통 컴포넌트 → `apps/weddin/src/shared/ui/`가 적합
- 기존 웨딘 공통 컴포넌트: Button, Menu, BottomSheet, SegmentedControl, Header, Badge, TopBar 등이 `apps/weddin/src/shared/ui/`에 위치
- `packages/shared/`는 앱 간 공유 컴포넌트 (moit + weddin)

**Decision**: `apps/weddin/src/shared/ui/number-stepper/NumberStepper.tsx`에 배치

**Rationale**: 웨딘 전용 컴포넌트이므로 weddin 앱의 shared 레이어에 배치. 기존 패턴과 일치.

**Alternatives considered**:

- `packages/shared/ui/` → 모노레포 공유 패키지는 양 앱 공통 컴포넌트용, 웨딘 전용이므로 부적합

### RQ-3: 스타일링 방식

**Question**: Tailwind CSS 커스텀 클래스 vs 인라인 스타일?

**Findings**:

- 프로젝트는 Tailwind CSS 4 + CVA + clsx + tailwind-merge 사용
- 기존 Button 컴포넌트는 CSS 클래스 기반 스타일링 사용
- 디자인 토큰(색상, 크기)이 Figma에 명확하게 정의되어 있음

**Decision**: Tailwind CSS 유틸리티 클래스 사용, 디자인 토큰은 인라인 스타일 또는 Tailwind arbitrary values로 처리

**Rationale**: 프로젝트 스타일링 컨벤션 준수. 색상값이 디자인 시스템 토큰으로 정의되어 있으므로 Tailwind arbitrary values가 적합.
