'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { MENU_CATEGORIES, MenuCategoryLabel } from '@/constants/menu';
import { useDateUrl } from '@/hooks/useDateUrl';
import { useHasMounted } from '@/hooks/useHasMounted';
import { usePick } from '@/hooks/usePick';
import { useVotes } from '@/hooks/useVote';
import dayjs from '@/lib/dayjs';
import { shareMenuUrl } from '@/lib/share';
import { useDateStore } from '@/store/useDateStore';
import { formatYYYYMMDD } from '@/utils/date';
import { isAfterClose, isFutureMenuPending } from '@/utils/menuPolicy';

import MenuBoardCourseRow from './_MenuBoardCourseRow/MenuBoardCourseRow';
import MenuBoardDayBar from './_MenuBoardDayBar/MenuBoardDayBar';
import MenuBoardEmpty from './_MenuBoardEmpty/MenuBoardEmpty';
import {
  courseTabBarClass,
  courseTabClass,
  menuBodyClass,
  sectionClass,
} from './MenuBoard.styles';
import { MenuBoardProps } from './MenuBoard.types';

const MenuBoard = ({ menus, isKorea }: MenuBoardProps) => {
  useDateUrl();
  const { today, selectedDate } = useDateStore();
  const mounted = useHasMounted();
  const dateStr = formatYYYYMMDD(selectedDate);
  const [tabState, setTabState] = useState({ dateStr, tab: 0 });
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

  const safeTab =
    tabState.dateStr === dateStr
      ? Math.min(tabState.tab, Math.max(0, dayMenus.length - 1))
      : 0;
  const setSelectedTab = (tab: number) => setTabState({ dateStr, tab });

  const emptyVariant = isFutureMenuPending(selectedDate, now)
    ? 'comingUp'
    : 'closed';

  const handleShare = async () => {
    sendGAEvent('event', 'share_menu', { date: dateStr });
    const result = await shareMenuUrl(dateStr);
    if (result === 'copied') toast.success('링크 복사됨');
    if (result === 'error') toast.error('링크 복사 실패');
  };

  return (
    <section className={sectionClass}>
      <MenuBoardDayBar onShare={handleShare} />
      {dayMenus.length > 1 && (
        <div className={courseTabBarClass}>
          {dayMenus.map((menu, i) => (
            <button
              key={menu.category}
              type="button"
              onClick={() => setSelectedTab(i)}
              aria-pressed={safeTab === i}
              className={courseTabClass(safeTab === i)}
            >
              {MenuCategoryLabel[menu.category].ko}
            </button>
          ))}
        </div>
      )}
      <div className={menuBodyClass}>
        {dayMenus.length > 0 ? (
          dayMenus.map((menu, i) => {
            const menuKey = `${menu.date}_${menu.category}`;
            return (
              <div
                key={menu.category}
                className={
                  i !== safeTab ? 'hidden h-full min-[640px]:block' : 'h-full'
                }
              >
                <MenuBoardCourseRow
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
              </div>
            );
          })
        ) : (
          <div className="col-span-full">
            <MenuBoardEmpty
              variant={emptyVariant}
              date={dateStr}
              isToday={isToday}
              isPast={isPast}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuBoard;
