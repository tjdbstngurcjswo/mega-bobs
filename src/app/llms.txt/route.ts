import { NextResponse } from 'next/server';

import { SITE_NAME } from '@/constants/site';
import { SITE_URL } from '@/utils/env';
import { SITE_DESC } from '@/utils/jsonLd';

const CONTENT = `# ${SITE_NAME}

> ${SITE_DESC}

## 핵심 페이지

- [식단표](${SITE_URL}/): 이번 주 코스1·코스2·테이크아웃 메뉴, 실시간 운영 상태, 맛 평가 투표
- [공지사항](${SITE_URL}/notice): 신규 기능, 점검, 운영 안내
- [메가존 소식](${SITE_URL}/news): 메가존·메가존클라우드·메가존소프트 뉴스 모음
- [미니게임](${SITE_URL}/games): 사내 구성원을 위한 미니게임

## 정책

- [이용약관](${SITE_URL}/terms)
- [개인정보처리방침](${SITE_URL}/privacy)
- [문의](${SITE_URL}/contact)
`;

export const GET = () =>
  new NextResponse(CONTENT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
