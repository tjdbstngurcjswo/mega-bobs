'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { Share2 } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useHasMounted } from '@/hooks/useHasMounted';
import { shareMenuUrl } from '@/lib/share';
import { useDateStore } from '@/store/useDateStore';
import { formatYYYYMMDD } from '@/utils/date';

import {
  chipAreaClass,
  chipRowClass,
  dayBarContainerClass,
  indicatorClass,
  navArrowClass,
  navButtonClass,
  navTooltipClass,
  shareBtnClass,
  weekLabelClass,
  weekRangeClass,
} from './MenuBoardDayBar.styles';
import MenuBoardDayChip from './MenuBoardDayChip';

const MenuBoardDayBar = () => {
  const {
    today,
    selectedDate,
    currentWeek,
    minDate,
    maxDate,
    setSelectedDate,
    goToPrevWeek,
    goToNextWeek,
    refreshToday,
  } = useDateStore();
  const mounted = useHasMounted();

  useEffect(() => {
    const id = setInterval(refreshToday, 60_000);
    return () => clearInterval(id);
  }, [refreshToday]);

  const handleShare = async () => {
    const dateStr = formatYYYYMMDD(selectedDate);
    sendGAEvent('event', 'share_menu', { date: dateStr });
    const result = await shareMenuUrl(dateStr);
    if (result === 'copied') toast.success('링크 복사됨');
    if (result === 'error') toast.error('링크 복사 실패');
  };

  const canGoPrev = !mounted || currentWeek[0].isAfter(minDate, 'day');
  const canGoNext = !mounted || currentWeek[6].isBefore(maxDate, 'day');

  const isCurrentWeek =
    mounted && currentWeek.some((d) => d.isSame(today, 'day'));
  const prevLabel = isCurrentWeek ? '지난주' : '이번주';
  const nextLabel = isCurrentWeek ? '다음주' : '이번주';

  return (
    <div className={dayBarContainerClass}>
      <div className={weekLabelClass}>
        <button
          type="button"
          onClick={() => {
            sendGAEvent('event', 'week_navigate', { direction: 'prev' });
            goToPrevWeek();
          }}
          aria-label="지난주 메뉴 보기"
          className={navButtonClass(canGoPrev)}
        >
          <span className={navArrowClass}>‹</span>
          <span className={navTooltipClass}>{prevLabel}</span>
        </button>
        <span suppressHydrationWarning className={weekRangeClass}>
          {mounted
            ? `${currentWeek[0].format('M월 D일')} - ${currentWeek[6].format('M월 D일')}`
            : ''}
        </span>
        <button
          type="button"
          onClick={() => {
            sendGAEvent('event', 'week_navigate', { direction: 'next' });
            goToNextWeek();
          }}
          aria-label="다음 주 메뉴 보기"
          className={navButtonClass(canGoNext)}
        >
          <span className={navArrowClass}>›</span>
          <span className={navTooltipClass}>{nextLabel}</span>
        </button>
        <button
          type="button"
          onClick={handleShare}
          aria-label="메뉴 링크 공유"
          className={shareBtnClass}
        >
          <Share2 size={13} strokeWidth={2} aria-hidden />
        </button>
      </div>
      <div className={chipAreaClass}>
        <div
          key={currentWeek[0]?.format('YYYY-MM-DD')}
          className={chipRowClass}
          style={{ animation: 'fadeIn 0.2s ease both' }}
        >
          {(() => {
            const idx = mounted
              ? currentWeek.findIndex((d) => d.isSame(selectedDate, 'day'))
              : -1;
            const isToday = mounted && selectedDate.isSame(today, 'day');
            return idx >= 0 ? (
              <div
                aria-hidden
                className={indicatorClass(isToday)}
                style={{
                  width: 'calc((100% - 36px) / 7)',
                  transform: `translateX(calc(${idx} * (100% + 6px)))`,
                }}
              />
            ) : null;
          })()}
          {currentWeek.map((day) => (
            <MenuBoardDayChip
              key={day.format('YYYY-MM-DD')}
              day={day}
              today={today}
              selectedDate={selectedDate}
              onSelect={(d) => {
                sendGAEvent('event', 'day_select', {
                  offset: d.diff(today, 'day'),
                });
                setSelectedDate(d);
              }}
              mounted={mounted}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuBoardDayBar;
