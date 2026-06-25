'use client';

import { sendGAEvent } from '@next/third-parties/google';

import { useHasMounted } from '@/hooks/useHasMounted';
import { useDateStore } from '@/store/useDateStore';

import { todayBtnClass } from './HeroTodayButton.styles';

const HeroTodayButton = () => {
  const { today, currentWeek, goToToday } = useDateStore();
  const mounted = useHasMounted();

  const isCurrentWeek =
    mounted && currentWeek.some((d) => d.isSame(today, 'day'));

  if (!mounted || isCurrentWeek) return null;

  return (
    <button
      type="button"
      onClick={() => {
        sendGAEvent('event', 'week_navigate', { direction: 'today' });
        goToToday();
      }}
      aria-label="오늘 날짜로 이동"
      className={todayBtnClass}
    >
      오늘
    </button>
  );
};

export default HeroTodayButton;
