# 모노레포 전환 계획

## Context

moit 서비스에 weddin 서비스를 추가하기 위해 모노레포로 전환한다. `src/shared/`를 공용 패키지로 분리하여 두 앱에서 공유한다. npm workspaces를 사용하고, Turborepo는 도입하지 않는다. shared 패키지는 빌드 없이 TypeScript 소스를 직접 사용한다.

---

## 목표 디렉토리 구조

```
/ (repo root)
├── apps/
│   └── moit/
│       ├── src/
│       │   ├── app/
│       │   ├── app-providers/
│       │   ├── entities/
│       │   ├── features/
│       │   └── widgets/
│       ├── public/
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts
│       ├── postcss.config.js
│       └── .env
│
├── packages/
│   └── shared/
│       ├── api/
│       ├── assets/
│       ├── config/
│       ├── hooks/
│       ├── lib/
│       ├── providers/
│       ├── types/
│       ├── ui/
│       ├── package.json
│       └── tsconfig.json
│
├── .storybook/          (루트에 유지)
├── package.json         (workspaces 설정)
├── tsconfig.base.json   (공통 TS 설정)
├── eslint.config.mjs    (루트에 유지)
├── .prettierrc          (루트에 유지)
├── commitlint.config.ts (루트에 유지)
├── lefthook.yml         (루트에 유지)
└── lint-staged.config.mjs
```

---

## 실행 단계

### 1단계: 디렉토리 생성 + 파일 이동 (`git mv`)

**shared 패키지:**

- `src/shared/*` → `packages/shared/*`

**moit 앱:**

- `src/app/` → `apps/moit/src/app/`
- `src/app-providers/` → `apps/moit/src/app-providers/`
- `src/entities/` → `apps/moit/src/entities/`
- `src/features/` → `apps/moit/src/features/`
- `src/widgets/` → `apps/moit/src/widgets/`
- `public/` → `apps/moit/public/`
- `next.config.ts` → `apps/moit/next.config.ts`
- `postcss.config.js` → `apps/moit/postcss.config.js`
- `.env` → `apps/moit/.env`

### 2단계: 새 설정 파일 생성

**루트 `package.json`** - workspaces 추가, 앱 의존성 제거, 공용 devDeps만 유지:

```json
{
  "name": "27th-web-team-2-fe",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "npm run dev --workspace=apps/moit",
    "build": "npm run build --workspace=apps/moit",
    "lint": "eslint",
    "typecheck": "tsc --noEmit --project apps/moit/tsconfig.json",
    "format": "prettier --write .",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "prepare": "lefthook install",
    "lint-staged": "lint-staged --config lint-staged.config.mjs",
    "commitlint": "commitlint"
  },
  "devDependencies": {
    /* ESLint, Prettier, Storybook, Tailwind, TypeScript, Lefthook 등 공용 도구 */
  }
}
```

**`tsconfig.base.json`** (새 파일) - 공통 TS 옵션:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true
  },
  "exclude": ["node_modules"]
}
```

**`packages/shared/package.json`** (새 파일):

```json
{
  "name": "@repo/shared",
  "version": "0.0.0",
  "private": true,
  "peerDependencies": { "react": "^19.0.0", "react-dom": "^19.0.0" },
  "dependencies": {
    "@amplitude/analytics-browser": "^2.33.5",
    "@amplitude/session-replay-browser": "^1.30.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "copy-to-clipboard": "^3.3.3",
    "date-fns": "^4.1.0",
    "ky": "^1.14.2",
    "tailwind-merge": "^3.4.0",
    "vaul": "^1.1.2",
    "zod": "^4.3.5"
  }
}
```

**`packages/shared/tsconfig.json`** (새 파일):

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "paths": { "@repo/shared/*": ["./*"] }
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

**`apps/moit/package.json`** (새 파일):

```json
{
  "name": "@repo/moit",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@repo/shared": "*",
    "next": "16.1.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-datepicker": "^9.1.0"
  },
  "devDependencies": {
    "@types/react-datepicker": "^6.2.0",
    "msw": "^2.12.7"
  }
}
```

**`apps/moit/tsconfig.json`** (새 파일):

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@repo/shared/*": ["../../packages/shared/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

### 3단계: next.config.ts 수정

`apps/moit/next.config.ts`에 `transpilePackages` 추가:

```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['@repo/shared'],
  // ... rewrites 유지
};
```

### 4단계: import 경로 일괄 변경

**`@/shared/` → `@repo/shared/`** 전체 치환:

- `packages/shared/` 내부: ~18곳 (shared 내 @/shared/ 참조)
- `apps/moit/src/` 내부: ~55곳 (앱 코드의 @/shared/ 참조)

예시:

```
// Before
import Button from '@/shared/ui/button/Button';
// After
import Button from '@repo/shared/ui/button/Button';
```

### 5단계: Tailwind CSS v4 설정

`apps/moit/src/app/globals.css`에 `@source` 추가하여 shared 패키지 스캔:

```css
@import 'tailwindcss';
@source '../../../../packages/shared';

@theme {
  /* 기존 디자인 토큰 그대로 유지 */
}
```

### 6단계: Storybook 설정 업데이트

**`.storybook/main.ts`**:

```typescript
const config: StorybookConfig = {
  stories: [
    '../packages/shared/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../apps/moit/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../apps/moit/public'],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../apps/moit/src'),
      '@repo/shared': path.resolve(__dirname, '../packages/shared'),
    };
    return config;
  },
};
```

**`.storybook/preview.ts`** - CSS import 경로 수정:

```typescript
import '../apps/moit/src/app/globals.css';
```

### 7단계: 정리

삭제 대상:

- `src/` (이동 완료 후 빈 디렉토리)
- 루트 `tsconfig.json` (tsconfig.base.json으로 대체)
- 루트 `next-env.d.ts`, `tsconfig.tsbuildinfo`

`.gitignore` 수정: `/.next/` → `.next/` (하위 디렉토리에서도 매칭되도록)

### 8단계: 설치 및 검증

```bash
rm -rf node_modules package-lock.json
npm install
npm run build          # Next.js 빌드 확인
npm run typecheck      # TypeScript 확인
npm run lint           # ESLint 확인
npm run storybook      # Storybook 확인
grep -r "from '@/shared/" apps/ packages/  # 잔여 import 없는지 확인
```

---

## 주요 결정 사항

| 항목               | 결정                                              |
| ------------------ | ------------------------------------------------- |
| 패키지 매니저      | npm workspaces                                    |
| shared 패키지 빌드 | 없음 (transpilePackages로 직접 사용)              |
| import alias       | `@repo/shared/*` (패키지 이름 기반)               |
| Tailwind 토큰      | 각 앱의 globals.css에서 정의                      |
| Storybook          | 루트에서 전체 관리                                |
| env 변수           | 각 앱의 .env에서 관리 (shared는 빌드 시 주입받음) |

## TODO

- [x] .gitignore 패턴 모노레포 호환으로 수정
- [x] 디렉토리 구조 전환 + 파일 이동 (src/ → apps/moit/, packages/shared/)
- [x] import 경로 일괄 변경 (@/shared/ → @repo/shared/)
- [x] npm workspaces 설정 + 패키지 config 추가
- [x] next.config.ts transpilePackages 추가
- [x] Tailwind CSS @source 설정
- [x] Storybook 설정 업데이트
- [x] ESLint 설정 업데이트
- [x] 빌드/타입체크/린트 검증 통과
- [x] apps/weddin/ 기본 세팅
- [x] 각 앱 dev 포트 분리 (moit: 3000, weddin: 3001)
- [x] 루트 package.json에 dev:moit, dev:weddin 스크립트 추가

## 수정 대상 파일 요약

| 카테고리           | 파일 수                                                  |
| ------------------ | -------------------------------------------------------- |
| git mv (파일 이동) | ~60개 파일                                               |
| 새 설정 파일 생성  | 5개 (tsconfig.base, 2x package.json, 2x tsconfig)        |
| import 경로 변경   | ~73곳                                                    |
| 설정 파일 수정     | 5개 (next.config, globals.css, storybook x2, .gitignore) |
