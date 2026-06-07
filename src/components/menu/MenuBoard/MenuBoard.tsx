'use client';

import { CalendarDays, Info, MapPin } from 'lucide-react';
import { useMemo } from 'react';

import { MENU_CATEGORIES } from '@/constants/menu';
import dayjs from '@/lib/dayjs';
import { usePick } from '@/hooks/usePick';
import { useVotes } from '@/hooks/useVote';
import {
  isAfterClose,
  isNextWeek,
  isNextWeekPublished,
} from '@/utils/menuPolicy';
import { useHasMounted } from '@/hooks/useHasMounted';
import { formatYYYYMMDD } from '@/utils/date';
import { useDateStore } from '@/store/useDateStore';
import { MenuBoardProps } from './MenuBoard.types';

import BoardEmpty from './_BoardEmpty/BoardEmpty';
import CourseRow from './_CourseRow/CourseRow';
import DayBar from './_DayBar/DayBar';
import { todayButtonClass } from './MenuBoard.styles';

const MenuBoard = ({ menus }: MenuBoardProps) => {
  const { today, selectedDate, setSelectedDate } = useDateStore();
  const mounted = useHasMounted();
  const dateStr = formatYYYYMMDD(selectedDate);
  const hasMenus = useMemo(
    () => menus.some((m) => m.date === dateStr && m.items.length > 0),
    [menus, dateStr]
  );
  const { voteMap, submitVote, isSubmitting } = useVotes(dateStr, {
    enabled: hasMenus,
  });
  const {
    myPick,
    counts,
    submitPick,
    isSubmitting: isSubmittingPick,
  } = usePick(dateStr, { enabled: hasMenus });
  const isPast = mounted && selectedDate.isBefore(today, 'day');
  const isToday = mounted && selectedDate.isSame(today, 'day');
  const showVote = isPast || (isToday && isAfterClose(dayjs().tz()));
  const showPick = mounted && !showVote && !selectedDate.isBefore(today, 'day');

  const dayMenus = useMemo(() => {
    const key = formatYYYYMMDD(selectedDate);
    const found = menus.filter((m) => m.date === key && m.items.length > 0);
    return MENU_CATEGORIES.map((c) =>
      found.find((m) => m.category === c)
    ).filter((m): m is NonNullable<typeof m> => Boolean(m));
  }, [menus, selectedDate]);

  const emptyVariant =
    isNextWeek(selectedDate, today) && !isNextWeekPublished(today)
      ? 'comingUp'
      : 'closed';

  return (
    <section className="bg-surface flex flex-col shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="flex items-center gap-2">
          <span className="text-ink text-[14px] font-extrabold tracking-wide">
            메뉴
          </span>
          <span className="text-muted flex items-center gap-1 text-[11px] font-medium">
            <MapPin size={10} strokeWidth={2.5} />
            메가존 구내식당
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setSelectedDate(today)}
          aria-hidden={selectedDate.isSame(today, 'day')}
          className={todayButtonClass(selectedDate.isSame(today, 'day'))}
        >
          <CalendarDays size={11} strokeWidth={2.5} />
          오늘
        </button>
      </div>
      <DayBar />
      {dayMenus.length > 0 ? (
        dayMenus.map((menu, i) => {
          const menuKey = `${menu.date}_${menu.category}`;
          return (
            <CourseRow
              key={menu.category}
              menu={menu}
              index={i}
              showVote={showVote}
              voteResult={voteMap[menuKey]}
              onVote={(type) => submitVote(menuKey, type)}
              isSubmitting={isSubmitting}
              showPick={showPick}
              pickCount={counts[menu.category]}
              isPicked={myPick === menu.category}
              onPick={() => submitPick(menu.category)}
              isSubmittingPick={isSubmittingPick}
            />
          );
        })
      ) : (
        <BoardEmpty
          variant={emptyVariant}
          date={dateStr}
          isToday={isToday}
          isPast={isPast}
        />
      )}
      {(showVote || showPick) && dayMenus.length > 0 && (
        <p className="text-muted flex items-center gap-1.5 px-5 py-2.5 text-[10px] leading-relaxed">
          <Info size={11} strokeWidth={2} className="shrink-0" />
          {showVote
            ? '투표 데이터는 정확하지 않을 수 있으며, 맛평가를 위한 참고용 기능이에요.'
            : '투표 데이터는 정확하지 않을 수 있으며, 수요 예측을 위한 참고용 기능이에요.'}
        </p>
      )}
    </section>
  );
};

export default MenuBoard;
