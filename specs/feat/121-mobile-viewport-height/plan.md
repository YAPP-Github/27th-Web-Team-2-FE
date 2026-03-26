# Implementation Plan: 모바일 뷰포트 높이 개선

**Branch**: `feat/#121-mobile-viewport-height` | **Date**: 2026-03-26 | **Spec**: `specs/feat/121-mobile-viewport-height/spec.md`
**Input**: Feature specification from `/specs/feat/121-mobile-viewport-height/spec.md`

## Summary

모바일 브라우저에서 `100vh`가 동적 UI(주소창, 네비게이션 바)를 고려하지 않아 하단 CTA 버튼이 잘리는 문제를 해결한다. CSS `dvh` 단위를 활용한 커스텀 Tailwind 유틸리티와 viewport 메타태그 설정으로, JavaScript 없이 순수 CSS만으로 대응한다.

## Technical Context

**Language/Version**: TypeScript 5
**Framework**: Next.js 16 (App Router), React 19
**Styling**: Tailwind CSS 4 + CVA + clsx + tailwind-merge
**Testing**: Vitest + Playwright
**Target Platform**: 모바일 웹 (iOS Safari 15.4+, Android Chrome 108+), 데스크톱 웹
**Project Type**: single (Next.js App Router)
**Performance Goals**: CSS-only 솔루션 (JS 런타임 비용 0)
**Constraints**: dvh 미지원 브라우저에서 기존 vh 폴백 필수, 키보드 표시 시 레이아웃 점프 없어야 함
**Scale/Scope**: 9개 프로덕션 페이지 파일 + globals.css + layout.tsx (총 11개 파일 수정)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Gate             | Status | Notes                                                                                                                    |
| ---------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| FSD 레이어 준수  | PASS   | 이 변경은 `shared` 레이어(globals.css)와 각 feature/app 레이어의 CSS 클래스 변경만 포함. 레이어 간 의존성 방향 변화 없음 |
| 배럴 export 금지 | PASS   | CSS 유틸리티 추가이므로 import 구조에 영향 없음                                                                          |
| 단방향 의존성    | PASS   | 새로운 모듈 의존성 추가 없음. globals.css의 유틸리티 클래스는 모든 레이어에서 사용 가능                                  |
| 코드 스타일      | PASS   | function declaration 유지, 네이밍 규칙 준수                                                                              |

## Project Structure

### Documentation (this feature)

```text
specs/feat/121-mobile-viewport-height/
├── spec.md              # Feature specification
├── plan.md              # This file
└── research.md          # Phase 0 research output
```

### Source Code (affected files)

```text
src/
├── app/
│   ├── globals.css                    # [MODIFY] min-h-screen-safe 유틸리티 추가
│   ├── layout.tsx                     # [MODIFY] viewport meta tag에 interactive-widget 추가
│   ├── page.tsx                       # [MODIFY] min-h-screen → min-h-screen-safe
│   ├── [meetingId]/page.tsx           # [MODIFY] min-h-screen → min-h-screen-safe
│   └── meet/[meetingId]/page.tsx      # [MODIFY] min-h-screen → min-h-screen-safe
├── features/
│   ├── meet-create/ui/
│   │   └── MeetCreatePage.tsx         # [MODIFY] min-h-screen → min-h-screen-safe
│   ├── meet-create-date/ui/
│   │   └── DateSelectPage.tsx         # [MODIFY] min-h-screen → min-h-screen-safe
│   ├── participant-register-name/ui/
│   │   └── ParticipantRegisterNamePage.tsx  # [MODIFY] min-h-screen → min-h-screen-safe
│   ├── participant-register-date/ui/
│   │   └── ParticipantRegisterDatePage.tsx  # [MODIFY] min-h-screen → min-h-screen-safe (2곳)
│   ├── participant-edit-name/ui/
│   │   └── ParticipantEditNamePage.tsx      # [MODIFY] min-h-screen → min-h-screen-safe
│   └── participant-edit-date/ui/
│       └── ParticipantEditDatePage.tsx      # [MODIFY] min-h-screen → min-h-screen-safe (2곳)
└── (unchanged layers: entities/, shared/ui/, widgets/)
```

**Structure Decision**: 기존 FSD 구조 그대로 유지. 새 feature/entity 생성 불필요. `globals.css`에 커스텀 유틸리티 추가 + 기존 파일들의 클래스명 변경만 수행.

## Architecture Decision Table

### Decision 1: 뷰포트 높이 구현 방식

| Option                                   | Description                                                                    | Pros                                                      | Cons                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- | -------------------------------------------------------------- |
| **A. 커스텀 Tailwind 유틸리티 (CHOSEN)** | `globals.css`에 `min-h-screen-safe` 유틸리티 정의: `100vh` fallback + `100dvh` | JS 런타임 비용 0, 프로그레시브 인핸스먼트, 한 곳에서 관리 | 커스텀 클래스명                                                |
| B. Tailwind `min-h-dvh` 직접 사용        | Tailwind CSS 4 빌트인 `min-h-dvh` 클래스 사용                                  | 표준 Tailwind 클래스                                      | vh fallback 없음, dvh 미지원 브라우저에서 min-height 적용 안됨 |
| C. JS 기반 `--vh` CSS 변수               | `window.innerHeight` 기반 CSS custom property 계산                             | 완전한 제어                                               | JS 의존, 하이드레이션 필요, FOUC 위험, 복잡도 증가             |
| D. `min-h-screen min-h-dvh` 클래스 중첩  | 두 Tailwind 클래스를 동시에 적용                                               | 표준 클래스 사용                                          | Tailwind CSS 4의 CSS 생성 순서에 의존, cascade 보장 불가       |

**Rationale**: Option A는 CSS cascade를 활용해 동일 규칙 내에서 `vh → dvh` 순서를 보장하므로 모든 브라우저에서 올바르게 동작한다. JS 없이 동작하므로 SSR/SSG와 완벽히 호환되고, FOUC 없이 즉시 올바른 높이가 적용된다.

### Decision 2: 키보드 표시 시 뷰포트 처리

| Option                                              | Description                                                           | Pros                                 | Cons                            |
| --------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------ | ------------------------------- |
| **A. `interactive-widget=resizes-visual` (CHOSEN)** | viewport 메타태그에 추가하여 가상 키보드가 visual viewport만 리사이즈 | 표준 웹 API, CSS-only, dvh 영향 없음 | Chrome 108+ 지원 (타겟 범위 내) |
| B. JS 키보드 감지 + 높이 고정                       | `visualViewport` API로 키보드 감지 후 높이 고정                       | 세밀한 제어                          | 복잡도 높음, 브라우저 간 불일치 |

**Rationale**: `interactive-widget=resizes-visual`은 W3C 표준이며 타겟 브라우저 모두 지원한다. 키보드가 layout viewport를 리사이즈하지 않으므로 `dvh` 값이 키보드에 의해 변하지 않는다. iOS Safari는 이미 기본적으로 키보드를 오버레이하므로 Safari에서는 추가 효과 없이 호환된다.

### Decision 3: 비프로덕션 페이지 처리

| Option               | Description                                         | Pros                            | Cons                                     |
| -------------------- | --------------------------------------------------- | ------------------------------- | ---------------------------------------- |
| **A. 스킵 (CHOSEN)** | test, calendar-demo, Storybook 파일은 변경하지 않음 | 변경 범위 최소화, 프로덕션 집중 | 비프로덕션 환경에서는 동일 문제 남아있음 |
| B. 함께 변경         | 모든 `min-h-screen` 사용처를 일괄 변경              | 일관성                          | 불필요한 변경 범위 확대                  |

**Rationale**: test/demo/Storybook 파일은 사용자 대면 페이지가 아니므로 dvh 대응이 불필요하다.

## Phase 0 — Research

상세 연구 결과는 `research.md`에 기록.

### 핵심 연구 주제

1. **CSS `dvh` 단위 동작 방식과 브라우저 호환성**
2. **`interactive-widget` viewport 메타태그 동작과 호환성**
3. **Tailwind CSS 4에서의 커스텀 유틸리티 정의 방식**
4. **Next.js 16 App Router에서의 viewport 메타태그 설정 방법**

## Phase 1 — Design & Implementation Plan

### 1. `globals.css` — 커스텀 유틸리티 추가

```css
@layer utilities {
  .min-h-screen-safe {
    min-height: 100vh;
    min-height: 100dvh;
  }
}
```

동일 규칙 내에서 `100vh` 다음에 `100dvh`를 선언하여:

- dvh 지원 브라우저: `100dvh` 사용 (주소창/네비바에 따라 동적 조정)
- dvh 미지원 브라우저: `100dvh` 무시 → `100vh` fallback

### 2. `layout.tsx` — Viewport 메타태그

Next.js 16 App Router의 `viewport` export를 활용:

```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-visual',
};
```

`interactive-widget=resizes-visual` 효과:

- 가상 키보드 표시 시 layout viewport 크기 유지
- 키보드가 visual viewport만 리사이즈 (콘텐츠 위에 오버레이)
- `dvh` 값이 키보드에 의해 변하지 않으므로 레이아웃 점프 방지

### 3. 페이지 파일 — 클래스 교체

모든 프로덕션 페이지 파일에서 `min-h-screen` → `min-h-screen-safe` 치환.

| File                                                                        | Occurrences |
| --------------------------------------------------------------------------- | ----------- |
| `src/app/page.tsx`                                                          | 1           |
| `src/app/[meetingId]/page.tsx`                                              | 1           |
| `src/app/meet/[meetingId]/page.tsx`                                         | 1           |
| `src/features/meet-create/ui/MeetCreatePage.tsx`                            | 1           |
| `src/features/meet-create-date/ui/DateSelectPage.tsx`                       | 1           |
| `src/features/participant-register-name/ui/ParticipantRegisterNamePage.tsx` | 1           |
| `src/features/participant-register-date/ui/ParticipantRegisterDatePage.tsx` | 2           |
| `src/features/participant-edit-name/ui/ParticipantEditNamePage.tsx`         | 1           |
| `src/features/participant-edit-date/ui/ParticipantEditDatePage.tsx`         | 2           |
| **합계**                                                                    | **11곳**    |

### 4. 테스트 전략

- **빌드 검증**: `npm run build` 성공 확인
- **타입 체크**: `npm run typecheck` 성공 확인
- **수동 테스트**: 모바일 Chrome/Safari에서 각 페이지 하단 버튼 가시성 확인
- **회귀 테스트**: 데스크톱 브라우저에서 레이아웃 변화 없음 확인

## Complexity Tracking

해당 없음. Constitution 위반 사항 없음.
