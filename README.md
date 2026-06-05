# MegaBobs 🍽️

메가존 구내식당 식단표를 확인하는 웹 애플리케이션입니다. 현재 **단순 식단 조회**에서 **"오늘 점심, 뭐 먹을지 정해주는 점심 허브"** 로 확장하는 Phase 1 개편을 진행 중입니다.

---

## 🚧 Phase 1 개편 (진행 중)

### 무엇을 개편하나

| 영역 | 현재 | 개편 후 |
|---|---|---|
| **정체성** | 식단표 뷰어 | 점심 의사결정 허브 (식단 + 투표 + 게임 + 맛집 + 콘텐츠) |
| **비주얼** | 블루 톤 · 둥근 모서리 · 375px 모바일 | 푸드 웜톤 리브랜딩 · 각진 에디토리얼 무드 · 반응형 880px |
| **상호작용** | 메뉴 조회만 | 코스별 투표, 점심 내기 게임, 맛집 탐색, 자동 발행 블로그 |

### 어떻게 개편하나

- **🎨 푸드 웜톤 리브랜딩** — 뉴트럴 모노 베이스 + **단일 옐로우 키컬러(`#E2C04C`)**. 각진 모서리(radius 2~6px, pill 제거), 플랫 헤어라인, UI 이모지 제거(세리프 넘버링·이니셜·타이포 글리프로 대체). 디스플레이는 Noto Serif KR, 본문은 Pretendard.
- **🗳️ 코스 투표** — 식단 보드에서 코스별 "맛있다 / 별로다" 투표 + 결과 막대. 다음 날 블로그 자동 정리에 활용.
- **🎮 점심 내기 게임 3종** — 사다리 / 슬롯 / 풍선. 결과는 시작 전 미리 계산하고 연출만 재생(조작 불가). 슬랙 공유 + OG 이미지.
- **📍 주변 맛집** — 카테고리·가격 필터, 카드형 목록 + 상세(메뉴·영업시간·꿀팁). 진입/상세 조회 계측.
- **📰 블로그 + 소식** — 투표 결과 기반 데일리 리포트 자동 발행, 운영자 리뷰, 외부 소식 큐레이션 (AdSense "얇은 콘텐츠" 방지 구조).
- **📱 반응형** — 데스크톱 2컬럼 / 모바일 1컬럼(다크 밴드 헤더 + 풀스크린 드로어 + 바텀시트), 터치 타겟 ≥44px, `prefers-reduced-motion` 대응.

### 📐 기획·디자인 문서

- **디자인 문서 (SSOT)**: [`docs/design/2026-06-05-phase1-design.md`](docs/design/2026-06-05-phase1-design.md)
- **HTML 목업**: [`docs/design/mockups/`](docs/design/mockups/)
- **Figma**: https://www.figma.com/design/Db40M9n99faf18mk211nM4

---

## ✨ 주요 기능 (현재)

- 📅 **날짜별 메뉴 조회**: 원하는 날짜의 식단을 확인할 수 있습니다
- 🍝 **다양한 코스 메뉴**: 코스1, 코스2, 테이크아웃 메뉴를 선택할 수 있습니다
- 💬 **Slack 봇 연동**: 슬래시 커맨드(오늘/내일/모레/글피)로 식단 조회
- 📱 **모바일 최적화**: 반응형 디자인으로 모든 디바이스에서 사용 가능합니다
- ⚡ **빠른 로딩**: ISR 캐싱과 캐시 워밍으로 최적화된 성능을 제공합니다

## 🛠️ 기술 스택

### Frontend

- **Next.js 15** (App Router) - React 프레임워크
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Tailwind CSS 4** - 스타일링 (커스텀 테마 토큰)
- **Zustand** - 클라이언트 상태 관리 (menu / date 스토어)
- **TanStack Query** - 서버 상태 관리
- **next-themes** - 다크모드, **react-hot-toast** - 토스트, **dayjs** - 날짜(Asia/Seoul)

### Backend & Database

- **Supabase** - 백엔드 서비스 및 PostgreSQL 데이터베이스
- **MCP 서버** - Streamable HTTP 기반 (`pnpm mcp`)
- **Vercel** - 배포, **Zod** - 스키마 검증

### Development Tools

- **ESLint** / **Prettier** - 코드 품질·포맷팅
- **pnpm** - 패키지 매니저

## 🚀 시작하기

### 필수 조건

- Node.js 18.17 이상
- pnpm (권장) 또는 npm/yarn

### 설치 및 실행

1. **저장소 클론**

   ```bash
   git clone https://github.com/hong-soohyuk/mega-bobs.git
   cd mega-bobs
   ```

2. **의존성 설치**

   ```bash
   pnpm install
   ```

3. **환경 변수 설정**

   ```bash
   cp .env.example .env.local
   ```

   `.env.local` 파일에 다음 환경 변수를 설정하세요:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   REVALIDATE_SECRET=your_revalidate_secret
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **개발 서버 실행**

   ```bash
   pnpm dev
   ```

5. **브라우저에서 확인**
   [http://localhost:3000](http://localhost:3000)에서 앱을 확인할 수 있습니다.

## 📝 사용 가능한 스크립트

```bash
pnpm dev            # 개발 서버 (Turbopack)
pnpm build          # 프로덕션 빌드
pnpm start          # 프로덕션 서버
pnpm lint           # 린트 검사
pnpm lint:fix       # 린트 자동 수정
pnpm format         # 코드 포맷팅
pnpm format:check   # 포맷 검사
pnpm mcp            # MCP 서버 실행
```

## 📁 프로젝트 구조

```
src/
├── app/                  # Next.js App Router (페이지 + API 라우트)
│   ├── api/             # menu / slack / revalidate / mcp 라우트
│   ├── layout.tsx       # 루트 레이아웃
│   └── page.tsx         # 홈 (ISR 6h, 서버 fetch)
├── components/          # React 컴포넌트 (layout/ + 피처 컴포넌트)
├── lib/                 # supabase-server.ts, api/getMenu.ts, utils.ts, dayjs.ts
├── store/               # Zustand 스토어 (useMenuStore, useDateStore)
├── types/               # TypeScript 타입 (MenuType, MenuCategory, ...)
└── constants/           # 메뉴 카테고리, 식사 타입, Slack 커맨드 상수
```

## 🤖 Claude 스킬

프로젝트 작업을 돕는 Claude 스킬/커맨드가 [`.claude/`](.claude/) 에 있습니다.

- **`/pr`** — diff 분석 후 구조화된 PR 본문(요약·Changes 테이블·Mermaid 시퀀스·테스트 계획)을 생성하고 `gh pr create` 실행
- 스킬 목록과 작성 가이드는 [`.claude/skills/README.md`](.claude/skills/README.md) 참고
