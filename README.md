# MegaBobs

메가존 직원을 위한 구내식당 메뉴 뷰어. 날짜별 식단 조회, Slack 봇 연동, 실시간 운영 상태 표시를 제공합니다.

---

## 주요 기능

- **날짜별 메뉴 조회** — 주간 캘린더로 코스1 · 코스2 · 테이크아웃 메뉴 확인
- **맛 평가 투표** — 코스별 👍 / 👎 실시간 투표
- **식전 픽** — 코스A / 코스B / 테이크아웃 / 패스 선택
- **미니게임 허브** — 사다리게임 · 슬롯머신 · 풍선터뜨리기 (준비 중)
- **공지사항** — 헤더 벨 알림, 공지 목록 · 상세 페이지
- **Slack 봇** — `/밥` 커맨드로 오늘 · 내일 · 모레 · 글피 메뉴 조회
- **MCP 서버** — Claude Desktop 연동 (`/api/mcp`)
- **ISR 캐싱** — 6시간 자동 재검증, 매일 15:00 UTC 캐시 워밍 (Vercel Cron)

---

## 기술 스택

| 분류         | 기술                                               |
| ------------ | -------------------------------------------------- |
| 프레임워크   | Next.js 15 (App Router, Turbopack)                 |
| UI           | React 19, Tailwind CSS v4, Lucide React            |
| 상태 관리    | Zustand                                            |
| 데이터베이스 | Supabase (PostgreSQL)                              |
| 날짜 처리    | dayjs (`Asia/Seoul` timezone)                      |
| 배포         | Vercel                                             |
| 테스트       | Vitest, Testing Library                            |
| 포맷         | ESLint, Prettier (+ `prettier-plugin-tailwindcss`) |

---

## 디자인 시스템

토큰 · 타이포 · 컬러 · 간격 · 접근성 규칙은 [DESIGN.md](DESIGN.md)를 참고하세요.

---

## 시작하기

`.env.local` 파일을 생성하고 아래 값을 채워주세요:

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
REVALIDATE_SECRET=
API_KEY=
CRON_SECRET=
NEXT_PUBLIC_SITE_URL=
```

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

주요 스크립트: `pnpm build` · `pnpm lint` · `pnpm test` · `pnpm mcp`

---

## Notion 문서

> 스킬에서 Notion API 호출 시 아래 ID를 참조한다.

| 문서               | 링크                                                                                    | Notion ID                              |
| ------------------ | --------------------------------------------------------------------------------------- | -------------------------------------- |
| 기획문서 (Phase 1) | [Phase-1](https://app.notion.com/p/pionari/Phase-1-376cb4f84b7f81ba8a2cc6c54aa75fd1)   | `376cb4f8-4b7f-81ba-8a2c-c6c54aa75fd1` |
| 티켓 보드 (DB)     | —                                                                                       | `377cb4f8-4b7f-8012-ad8c-ca1ca0bfad59` |
