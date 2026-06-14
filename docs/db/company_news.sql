-- company_news — 메가존 3사(메가존 / 메가존클라우드 / 메가존소프트) 뉴스 수집 테이블
-- 수집: Google News RSS → /api/news/crawl 크론(매일 아침) → upsert(onConflict: url)
-- 조회: src/lib/api/getNews.ts (서버사이드, service_role) → /news 페이지 ISR
-- Supabase 대시보드 > SQL Editor에서 1회 실행한다.

create table if not exists public.company_news (
  url           text        primary key,             -- 원문 링크 (중복제거 키)
  title         text        not null,                -- 제목
  summary       text,                                -- 1~2문장 요약 (RSS description 태그 제거)
  source        text,                                -- 출처 칩 = 발행 매체명 (예: ZDNet Korea)
  company       text        not null,                -- 매칭 키워드: 'megazone' | 'megazonecloud' | 'megazonesoft'
  published_at  timestamptz not null,                -- 원문 발행일
  created_at    timestamptz not null default now()   -- 수집 시각
);

-- 최신순 정렬 인덱스
create index if not exists company_news_published_at_idx
  on public.company_news (published_at desc);

-- RLS 활성화 — 읽기/쓰기 모두 서버사이드(service_role)에서만 수행하므로 anon 정책 없음.
-- service_role 은 RLS 를 우회한다 (Cron 크롤 + ISR 조회).
alter table public.company_news enable row level security;
