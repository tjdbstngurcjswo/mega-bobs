'use client';

import { Clock } from 'lucide-react';
import { useLayoutEffect, useMemo, useRef } from 'react';

import { CAFETERIA_LABEL } from '@/constants/cafeteria';
import { MENU_CATEGORIES } from '@/constants/menu';
import { useHasMounted } from '@/hooks/useHasMounted';
import { usePick } from '@/hooks/usePick';
import { useVotes } from '@/hooks/useVote';
import dayjs from '@/lib/dayjs';
import { useDateStore } from '@/store/useDateStore';
import { formatYYYYMMDD } from '@/utils/date';
import { isAfterClose, isFutureMenuPending } from '@/utils/menuPolicy';

import MenuBoardCourseRow from './_MenuBoardCourseRow/MenuBoardCourseRow';
import MenuBoardDayBar from './_MenuBoardDayBar/MenuBoardDayBar';
import MenuBoardEmpty from './_MenuBoardEmpty/MenuBoardEmpty';
import {
  menuBodyClass,
  menuHeadingTitleClass,
  menuSubheadingClass,
  sectionClass,
} from './MenuBoard.styles';
import { MenuBoardProps } from './MenuBoard.types';

const MenuBoard = ({ menus, isKorea }: MenuBoardProps) => {
  const { today, selectedDate } = useDateStore();
  const mounted = useHasMounted();
  const dateStr = formatYYYYMMDD(selectedDate);
  const hasMenus = useMemo(
    () => menus.some((m) => m.date === dateStr && m.items.length > 0),
    [menus, dateStr]
  );
  const { voteMap, submitVote, isLoading, isSubmitting } = useVotes(dateStr, {
    enabled: hasMenus,
  });
  const {
    myPick,
    counts,
    submitPick,
    isLoading: isLoadingPick,
    isSubmitting: isSubmittingPick,
  } = usePick(dateStr, { enabled: hasMenus });
  const now = dayjs().tz();
  const isToday = selectedDate.isSame(today, 'day');
  const isPast = selectedDate.isBefore(today, 'day');
  const showVote =
    isKorea && mounted && (isPast || (isToday && isAfterClose(now)));
  const showPick = isKorea && mounted && !showVote && !isPast;

  const dayMenus = useMemo(() => {
    const key = formatYYYYMMDD(selectedDate);
    const found = menus.filter((m) => m.date === key && m.items.length > 0);
    return MENU_CATEGORIES.map((c) =>
      found.find((m) => m.category === c)
    ).filter((m): m is NonNullable<typeof m> => Boolean(m));
  }, [menus, selectedDate]);

  const emptyVariant = isFutureMenuPending(selectedDate, now)
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
    const a = el.animate([{ height: `${prev}px` }, { height: `${next}px` }], {
      duration: 280,
      easing: 'ease-in-out',
    });
    return () => a.cancel();
  }, [dateStr]);

  return (
    <section className={sectionClass}>
      <div className="flex items-center gap-2 px-6 py-4">
        <h2 className={menuHeadingTitleClass}>메가존 구내식당</h2>
        <p className={menuSubheadingClass}>
          <Clock
            size={9}
            strokeWidth={2.5}
            className="text-muted"
            aria-hidden
          />
          <span>{CAFETERIA_LABEL}</span>
        </p>
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
                  show: showVote && !isLoading,
                  result: voteMap[menuKey],
                  onVote: (type: 'up' | 'down') => submitVote(menuKey, type),
                  isSubmitting,
                }}
                pick={{
                  show: showPick && !isLoadingPick,
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
