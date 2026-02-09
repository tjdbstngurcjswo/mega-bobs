-- Slack OAuth 설치 정보를 저장하는 테이블
-- Supabase SQL Editor에서 실행하세요.

create table if not exists slack_installations (
  id bigint generated always as identity primary key,
  team_id text not null unique,
  team_name text,
  bot_user_id text,
  access_token text not null,
  scope text,
  installed_at timestamptz not null default now()
);

-- team_id로 빠르게 조회하기 위한 인덱스 (unique constraint가 이미 인덱스 역할)
-- 추가 인덱스가 필요하면 여기에 작성

-- RLS 활성화 (서버 사이드에서 service_role_key로 접근하므로 정책은 별도 불필요)
alter table slack_installations enable row level security;
