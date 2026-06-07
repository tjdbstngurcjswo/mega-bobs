import type {Notice} from '@/models/notice';

export const ANNOUNCEMENTS: Notice[] = [
    {
        id: 'dev-001',
        title: '[DEV] 공지 배너 테스트 — 이 메시지는 개발 환경에서만 보여요',
        body: 'env: development 필터링 확인용입니다.',
        publishedAt: '2026-06-01T09:00:00+09:00',
        env: ['development'],
    },
];
