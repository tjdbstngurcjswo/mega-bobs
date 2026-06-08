'use client';

import { CalendarDays, Clock } from 'lucide-react';
import { useLayoutEffect, useMemo, useRef } from 'react';

import { MENU_CATEGORIES } from '@/constants/menu';
import dayjs from '@/lib/dayjs';
import { usePick } from '@/hooks/usePick';
import { useVotes } from '@/hooks/useVote';
import { CAFETERIA_LABEL } from '@/constants/cafeteria';
import {
  isAfterClose,
  isNextWeekMenuLocked,
} from '@/utils/menuPolicy';
import { useHasMounted } from '@/hooks/useHasMounted';
import { formatYYYYMMDD } from '@/utils/date';
import { useDateStore } from '@/store/useDateStore';
import { MenuBoardProps } from './MenuBoard.types';

import MenuBoardEmpty from './_MenuBoardEmpty/MenuBoardEmpty';
import MenuBoardCourseRow from './_MenuBoardCourseRow/MenuBoardCourseRow';
import MenuBoardDayBar from './_MenuBoardDayBar/MenuBoardDayBar';
import {
  menuBodyClass,
  menuHeadingTitleClass,
  menuSubheadingClass,
  sectionClass,
  todayButtonClass,
} from './MenuBoard.styles';

const MenuBoard = ({ menus }: MenuBoardProps) => {
  const { today, selectedDate, goToToday } = useDateStore();
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
  const now = dayjs().tz();
  const isToday = selectedDate.isSame(today, 'day');
  const isPast = selectedDate.isBefore(today, 'day');
  const showVote = mounted && (isPast || (isToday && isAfterClose(now)));
  const showPick = mounted && !showVote && !isPast;

  const dayMenus = useMemo(() => {
    const key = formatYYYYMMDD(selectedDate);
    const found = menus.filter((m) => m.date === key && m.items.length > 0);
    return MENU_CATEGORIES.map((c) =>
      found.find((m) => m.category === c)
    ).filter((m): m is NonNullable<typeof m> => Boolean(m));
  }, [menus, selectedDate]);

  const emptyVariant = isNextWeekMenuLocked(selectedDate, now)
    ? 'comingUp'
    : 'closed';

  const menuBodyRef = useRef<HTMLDivElement>(null);
  const prevHeightRef = useRef(0);

  useLayoutEffect(() => {
    const el = menuBodyRef.current;
    if (!el) return;
    const next = el.scrollHeight;
    const prev = prevHeightRef.current;
    prevHeightRef.current = next;
    if (!prev || prev === next) return;
    const a = el.animate(
      [{ height: `${prev}px` }, { height: `${next}px` }],
      { duration: 280, easing: 'ease-in-out' }
    );
    return () => a.cancel();
  }, [dateStr]);

  return (
    <section className={sectionClass}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <h2 className={menuHeadingTitleClass}>식단표</h2>
          <p className={menuSubheadingClass}>
            <Clock size={9} strokeWidth={2.5} className="text-muted" aria-hidden />
            <span>{CAFETERIA_LABEL}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => goToToday()}
          aria-hidden={selectedDate.isSame(today, 'day')}
          className={todayButtonClass(selectedDate.isSame(today, 'day'))}
        >
          <CalendarDays size={11} strokeWidth={2.5} />
          오늘
        </button>
      </div>
      <MenuBoardDayBar />
      <div ref={menuBodyRef} className={menuBodyClass}>
        {dayMenus.length > 0 ? (
          dayMenus.map((menu) => {
            const menuKey = `${menu.date}_${menu.category}`;
            return (
              <MenuBoardCourseRow
                key={menu.category}
                menu={menu}
                vote={{
                  show: showVote,
                  result: voteMap[menuKey],
                  onVote: (type: 'up' | 'down') => submitVote(menuKey, type),
                  isSubmitting,
                }}
                pick={{
                  show: showPick,
                  count: counts[menu.category],
                  isPicked: myPick === menu.category,
                  hasAnyPick: myPick !== null,
                  onPick: () => submitPick(menu.category),
                  isSubmitting: isSubmittingPick,
                }}
              />
            );
          })
        ) : (
          <MenuBoardEmpty
            variant={emptyVariant}
            date={dateStr}
            isToday={isToday}
            isPast={isPast}
          />
        )}
      </div>

    </section>
  );
};

export default MenuBoard;
