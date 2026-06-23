'use client';

import { useMemo } from 'react';

import { MENU_CATEGORIES } from '@/constants/menu';
import { useAnimatedHeight } from '@/hooks/useAnimatedHeight';
import { useHasMounted } from '@/hooks/useHasMounted';
import { usePick } from '@/hooks/usePick';
import { useSharedDateQuery } from '@/hooks/useSharedDateQuery';
import { useVotes } from '@/hooks/useVote';
import dayjs from '@/lib/dayjs';
import { useDateStore } from '@/store/useDateStore';
import { isAfterClose, isFutureMenuPending } from '@/utils/menuPolicy';

import MenuBoardCourseRow from './_MenuBoardCourseRow/MenuBoardCourseRow';
import MenuBoardDayBar from './_MenuBoardDayBar/MenuBoardDayBar';
import MenuBoardEmpty from './_MenuBoardEmpty/MenuBoardEmpty';
import MenuBoardHeader from './_MenuBoardHeader';
import { menuBodyClass, sectionClass } from './MenuBoard.styles';
import { MenuBoardProps } from './MenuBoard.types';

const MenuBoard = ({ menus, isKorea }: MenuBoardProps) => {
  const { today, selectedDate } = useDateStore();
  const mounted = useHasMounted();
  const dateStr = useSharedDateQuery();
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
    const found = menus.filter((m) => m.date === dateStr && m.items.length > 0);
    return MENU_CATEGORIES.map((c) =>
      found.find((m) => m.category === c)
    ).filter((m): m is NonNullable<typeof m> => Boolean(m));
  }, [menus, dateStr]);

  const emptyVariant = isFutureMenuPending(selectedDate, now)
    ? 'comingUp'
    : 'closed';

  const menuBodyRef = useAnimatedHeight<HTMLDivElement>(dateStr);

  return (
    <section className={sectionClass}>
      <MenuBoardHeader date={dateStr} />
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
