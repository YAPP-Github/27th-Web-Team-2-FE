# Research: 모바일 뷰포트 높이 개선

**Feature**: `feat/#121-mobile-viewport-height`
**Date**: 2026-03-26

## Research 1: CSS `dvh` 단위

### Decision

`100dvh` (Dynamic Viewport Height)를 `100vh` fallback과 함께 사용한다.

### Rationale

- `100vh`는 모바일 브라우저의 "최대 뷰포트 높이"를 반환하며, 주소창/네비게이션 바 표시 상태를 고려하지 않음
- `100dvh`는 현재 가시 영역에 맞춰 동적으로 변하며, 주소창이 표시되면 줄어들고 숨겨지면 늘어남
- `100svh` (Small Viewport Height)는 항상 주소창이 보이는 상태의 높이를 반환하여 보수적이지만, 주소창이 숨겨진 상태에서 빈 공간이 발생함
- `100lvh` (Large Viewport Height)는 `100vh`와 사실상 동일하여 문제가 해결되지 않음

### Alternatives Considered

- **`100svh`**: 보수적 접근이지만 주소창이 숨겨질 때 하단에 빈 공간이 생김. 사용자 경험이 부자연스러움
- **`100lvh`**: `100vh`와 동일한 문제 재현
- **JS 기반 `window.innerHeight`**: 런타임 비용, 하이드레이션 복잡도, FOUC 위험

### Browser Support

- iOS Safari: 15.4+ (2022-03)
- Chrome Android: 108+ (2022-12)
- Firefox: 120+ (2023-11)
- Desktop Chrome/Edge/Firefox: 모두 지원
- IE/구형 모바일: 미지원 → `100vh` fallback으로 기존과 동일하게 동작

## Research 2: `interactive-widget` viewport 메타태그

### Decision

`<meta name="viewport" content="..., interactive-widget=resizes-visual">`을 추가한다.

### Rationale

- 기본 동작: Android Chrome에서 가상 키보드가 layout viewport를 리사이즈 → `dvh` 값이 줄어들어 레이아웃 점프 발생
- `resizes-visual`: 키보드가 visual viewport만 리사이즈하고 layout viewport는 유지 → `dvh` 값 불변, 레이아웃 안정
- iOS Safari: 기본적으로 키보드가 오버레이 방식이므로 이 메타태그와 무관하게 동일 동작
- W3C CSSWG 표준으로 채택됨

### Alternatives Considered

- **JS VisualViewport API 감지**: `visualViewport.resize` 이벤트로 키보드 감지 후 높이 고정. 복잡하고 브라우저 간 불일치
- **아무것도 안 함**: Android Chrome에서 키보드 표시 시 dvh가 줄어들어 레이아웃 점프 발생

### Browser Support

- Chrome/Edge: 108+
- Firefox: 120+
- Safari: 이미 기본 오버레이 동작 (메타태그 불필요하지만 호환 가능)

## Research 3: Tailwind CSS 4 커스텀 유틸리티

### Decision

`globals.css`의 `@layer utilities` 블록에 `min-h-screen-safe` 커스텀 유틸리티를 정의한다.

### Rationale

- Tailwind CSS 4는 `@config` 파일 없이 CSS-first 설정 방식 사용
- `@layer utilities`에 정의한 클래스는 Tailwind의 다른 유틸리티와 동일한 specificity로 동작
- 이미 프로젝트에 `@layer utilities` 블록이 존재 (typography, animation)하여 패턴이 확립됨

### Alternatives Considered

- **`@theme`에 커스텀 spacing 추가**: `--min-height-screen-safe` 같은 토큰으로 `min-h-screen-safe` 자동 생성. 하지만 `min-height`에 두 가지 값(vh, dvh)을 동시에 넣는 fallback 패턴은 `@theme`으로 표현 불가
- **Tailwind 플러그인**: 별도 플러그인 패키지 생성. 오버엔지니어링

## Research 4: Next.js 16 App Router viewport 설정

### Decision

`layout.tsx`에서 `viewport` named export을 사용하여 메타태그를 설정한다.

### Rationale

- Next.js App Router는 `metadata`와 별도로 `viewport` export을 제공
- `Viewport` 타입에 `interactiveWidget` 필드가 있어 타입 안전하게 설정 가능
- 기존 `metadata` export와 공존

### Implementation

```typescript
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-visual',
};
```

### Alternatives Considered

- **`<meta>` JSX 직접 삽입**: App Router에서는 `metadata`/`viewport` export이 권장됨. 직접 JSX는 경고 발생 가능
