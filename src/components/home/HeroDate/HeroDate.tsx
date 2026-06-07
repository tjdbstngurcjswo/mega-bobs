'use client';

import dayjs from '@/lib/dayjs';

/**
 * 히어로 날짜 라벨 — ISR 정적 HTML에 박힌 '생성 시점 날짜' 대신
 * 클라이언트의 실제 오늘을 표시한다(캐시가 오래돼도 항상 정확).
 * suppressHydrationWarning: 생성 시점과 접속 시점 날짜가 다른 경우의 텍스트 차이를 허용.
 */
const HeroDate = () => (
  <span suppressHydrationWarning>{dayjs().tz().format('M월 D일 dddd')}</span>
);

export default HeroDate;
