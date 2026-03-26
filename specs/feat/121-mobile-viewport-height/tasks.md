# Tasks: 모바일 뷰포트 높이 개선

**Input**: Design documents from `/specs/feat/121-mobile-viewport-height/`
**Prerequisites**: plan.md (required), spec.md (required), research.md

**Tests**: 자동화된 테스트는 요청되지 않음. 빌드/타입체크/린트 검증만 포함.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (Next.js App Router)

---

## Phase 1: Setup

**Purpose**: 이 기능은 기존 프로젝트에 CSS 유틸리티를 추가하는 변경이므로 프로젝트 초기화가 불필요하다. 해당 없음.

---

## Phase 2: Foundational (CSS 인프라)

**Purpose**: 모든 페이지 변경의 전제 조건이 되는 CSS 유틸리티와 viewport 메타태그를 추가한다.

**CRITICAL**: 이 단계가 완료되어야 Phase 3의 클래스 교체가 의미를 가진다.

- [x] T001 Add `min-h-screen-safe` custom utility class to `src/app/globals.css` — define in existing `@layer utilities` block with `min-height: 100vh` fallback followed by `min-height: 100dvh`
- [x] T002 Add `viewport` named export with `interactive-widget: 'resizes-visual'` to `src/app/layout.tsx` — import `Viewport` type from `next`, add export alongside existing `metadata` export

**Checkpoint**: CSS 유틸리티와 viewport 메타태그가 준비됨. `min-h-screen-safe` 클래스가 Tailwind 빌드에 포함되는지 확인.

---

## Phase 3: User Story 1 — 모바일에서 하단 버튼이 항상 보이도록 개선 (Priority: P1) MVP

**Goal**: 모든 프로덕션 페이지의 `min-h-screen`을 `min-h-screen-safe`로 교체하여, 모바일 브라우저의 동적 UI(주소창, 네비게이션 바)에 의해 하단 CTA 버튼이 가려지지 않도록 한다.

**Independent Test**: 모바일 브라우저(Chrome, Safari)에서 각 페이지에 접속하여 주소창이 표시된 상태에서도 하단 버튼이 완전히 보이는지 확인한다.

### Implementation for User Story 1

**App layer pages** (라우팅 엔트리):

- [x] T003 [P] [US1] Replace `min-h-screen` with `min-h-screen-safe` in `src/app/page.tsx` — 온보딩 페이지 (1곳)
- [x] T004 [P] [US1] Replace `min-h-screen` with `min-h-screen-safe` in `src/app/[meetingId]/page.tsx` — 참여자 진입 페이지 (1곳)
- [x] T005 [P] [US1] Replace `min-h-screen` with `min-h-screen-safe` in `src/app/meet/[meetingId]/page.tsx` — 투표 결과 페이지 (1곳)

**Feature layer pages** (기능별 조립 컴포넌트):

- [x] T006 [P] [US1] Replace `min-h-screen` with `min-h-screen-safe` in `src/features/meet-create/ui/MeetCreatePage.tsx` — 모임 생성 페이지 (1곳)
- [x] T007 [P] [US1] Replace `min-h-screen` with `min-h-screen-safe` in `src/features/meet-create-date/ui/DateSelectPage.tsx` — 날짜 선택 페이지 (1곳)
- [x] T008 [P] [US1] Replace `min-h-screen` with `min-h-screen-safe` in `src/features/participant-register-name/ui/ParticipantRegisterNamePage.tsx` — 참여자 이름 입력 페이지 (1곳)
- [x] T009 [P] [US1] Replace `min-h-screen` with `min-h-screen-safe` in `src/features/participant-register-date/ui/ParticipantRegisterDatePage.tsx` — 참여자 날짜 선택 페이지 (2곳: 로딩 상태 + 메인 레이아웃)
- [x] T010 [P] [US1] Replace `min-h-screen` with `min-h-screen-safe` in `src/features/participant-edit-name/ui/ParticipantEditNamePage.tsx` — 참여자 이름 편집 페이지 (1곳)
- [x] T011 [P] [US1] Replace `min-h-screen` with `min-h-screen-safe` in `src/features/participant-edit-date/ui/ParticipantEditDatePage.tsx` — 참여자 날짜 편집 페이지 (2곳: 로딩 상태 + 메인 레이아웃)

**Checkpoint**: 모든 프로덕션 페이지에서 `min-h-screen`이 `min-h-screen-safe`로 교체됨. 모바일 브라우저에서 하단 CTA 버튼 가시성 검증 가능.

---

## Phase 4: User Story 2 — 데스크톱 환경에서 기존 레이아웃 유지 (Priority: P2)

**Goal**: 데스크톱 브라우저에서 기존 레이아웃이 변경되지 않음을 보장한다.

**Independent Test**: 데스크톱 브라우저에서 모든 페이지를 순회하며 기존 레이아웃과 동일하게 표시되는지 확인한다.

**Note**: 이 스토리는 별도 구현이 불필요하다. `min-h-screen-safe` 유틸리티가 `100vh` fallback을 포함하고, 데스크톱에서 `100dvh === 100vh`이므로 기존 동작이 자동으로 보존된다. dvh 미지원 브라우저에서도 `100vh` fallback으로 기존과 동일하게 동작한다.

### Verification for User Story 2

- [x] T012 [US2] Verify no visual regression on desktop by running `npm run build` successfully — production build confirms CSS utility is correctly compiled and no build errors exist

**Checkpoint**: 데스크톱 환경에서 레이아웃 변화 없음 확인. `100dvh`는 데스크톱에서 `100vh`와 동일하므로 시각적 차이 0.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: 코드 품질 검증 및 최종 확인

- [x] T013 Run `npm run typecheck` to verify TypeScript type safety — viewport export의 `Viewport` 타입 정합성 확인
- [x] T014 Run `npm run lint` to verify code quality — 모든 변경 파일이 ESLint + Prettier 규칙 준수 확인
- [x] T015 Verify no remaining `min-h-screen` in production pages — grep으로 `src/app/` 및 `src/features/` 내 `min-h-screen` 사용처가 없는지 확인 (test/demo/storybook 제외)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 해당 없음
- **Foundational (Phase 2)**: 즉시 시작 가능. T001, T002는 서로 다른 파일이므로 병렬 가능하나, 모두 완료되어야 Phase 3 진행
- **US1 (Phase 3)**: Phase 2 완료 후 시작. T003-T011 모두 서로 다른 파일이므로 전체 병렬 실행 가능
- **US2 (Phase 4)**: Phase 3 완료 후 빌드 검증
- **Polish (Phase 5)**: Phase 4 완료 후 최종 검증

### User Story Dependencies

- **User Story 1 (P1)**: Phase 2 (Foundational) 완료 후 시작. 다른 스토리에 의존하지 않음
- **User Story 2 (P2)**: 별도 구현 없음. US1 구현에 의해 자동 충족됨. 빌드 검증만 수행

### Within Each User Story

- US1: 모든 태스크가 독립된 파일 수정이므로 전체 병렬 가능
- US2: 단일 검증 태스크

### Parallel Opportunities

- **Phase 2**: T001 (globals.css) + T002 (layout.tsx) 병렬 가능
- **Phase 3**: T003-T011 전체 9개 태스크 병렬 가능 (모두 서로 다른 파일)
- **Phase 5**: T013 (typecheck) + T014 (lint) + T015 (grep 검증) 병렬 가능

---

## Parallel Example: User Story 1

```bash
# Phase 2: Launch foundational tasks in parallel (2 tasks, different files):
Task: "Add min-h-screen-safe utility to src/app/globals.css"
Task: "Add viewport export to src/app/layout.tsx"

# Phase 3: Launch ALL US1 tasks in parallel (9 tasks, all different files):
Task: "Replace min-h-screen in src/app/page.tsx"
Task: "Replace min-h-screen in src/app/[meetingId]/page.tsx"
Task: "Replace min-h-screen in src/app/meet/[meetingId]/page.tsx"
Task: "Replace min-h-screen in src/features/meet-create/ui/MeetCreatePage.tsx"
Task: "Replace min-h-screen in src/features/meet-create-date/ui/DateSelectPage.tsx"
Task: "Replace min-h-screen in src/features/participant-register-name/ui/ParticipantRegisterNamePage.tsx"
Task: "Replace min-h-screen in src/features/participant-register-date/ui/ParticipantRegisterDatePage.tsx"
Task: "Replace min-h-screen in src/features/participant-edit-name/ui/ParticipantEditNamePage.tsx"
Task: "Replace min-h-screen in src/features/participant-edit-date/ui/ParticipantEditDatePage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (globals.css + layout.tsx)
2. Complete Phase 3: User Story 1 (9개 페이지 클래스 교체)
3. **STOP and VALIDATE**: 모바일 브라우저에서 하단 버튼 가시성 확인
4. 빌드/타입체크/린트 검증 후 배포

### Incremental Delivery

1. Phase 2 완료 → CSS 인프라 준비
2. Phase 3 완료 → 모바일 뷰포트 개선 완료 (MVP)
3. Phase 4 완료 → 데스크톱 회귀 없음 확인
4. Phase 5 완료 → 코드 품질 최종 검증

---

## Notes

- [P] tasks = 서로 다른 파일, 의존성 없음
- [Story] label은 spec.md의 User Story에 매핑
- 비프로덕션 파일(test/, calendar-demo/, \*.stories.tsx)은 변경 대상에서 제외
- `min-h-screen-safe`는 `100vh` fallback + `100dvh`를 단일 규칙에 선언하여 CSS cascade로 프로그레시브 인핸스먼트 보장
- `interactive-widget=resizes-visual`로 키보드 표시 시 레이아웃 점프 방지 (FR-006 충족)
