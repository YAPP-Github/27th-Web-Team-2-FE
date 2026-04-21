# 27th-Web-Team-2-FE Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-14

## Active Technologies

- TypeScript 5 + React 19, Next.js 16 (App Router), Tailwind CSS 4 + CVA + clsx + tailwind-merge, vaul (바텀 시트 후보), date-fns ^4.1.0 (feat/#131-time-range-picker)
- TypeScript 5 + React 19, Next.js 16 (App Router), Tailwind CSS 4 + CVA + clsx + tailwind-merge, vaul(바텀 시트 — `@/shared/ui/bottom-sheet/BottomSheet`에서 캡슐화), date-fns ^4.1.0, react-datepicker ^9.1.0(기존), ky(HTTP), zod(검증), Amplitude(analytics) (feat/#131-time-range-picker)
- N/A — 클라이언트 상태만. 서버 저장은 `POST /v1/meeting` 바디에 직렬화된 `timeRange`로 단발 전송. (feat/#131-time-range-picker)

- TypeScript 5 + React 19, Next.js 16 (App Router), react-datepicker ^9.1.0, date-fns ^4.1.0 (feat/#127-calendar-drag-path)

- TypeScript 5 + React 19, Next.js 16 (App Router), react-datepicker, date-fns (feat/#118-date-click-race-fix)
- N/A (클라이언트 상태만 관련) (feat/#118-date-click-race-fix)

- TypeScript 5 + React 19, Next.js 16 (App Router), Tailwind CSS 4 + CVA + clsx + tailwind-merge (feat/#99-number-stepper)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5: Follow standard conventions

## Recent Changes

- feat/#131-time-range-picker: Added TypeScript 5 + React 19, Next.js 16 (App Router), Tailwind CSS 4 + CVA + clsx + tailwind-merge, vaul(바텀 시트 — `@/shared/ui/bottom-sheet/BottomSheet`에서 캡슐화), date-fns ^4.1.0, react-datepicker ^9.1.0(기존), ky(HTTP), zod(검증), Amplitude(analytics)
- feat/#131-time-range-picker: Added TypeScript 5 + React 19, Next.js 16 (App Router), Tailwind CSS 4 + CVA + clsx + tailwind-merge, vaul (바텀 시트 후보), date-fns ^4.1.0

- feat/#127-calendar-drag-path: Added TypeScript 5 + React 19, Next.js 16 (App Router), react-datepicker ^9.1.0, date-fns ^4.1.0

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
