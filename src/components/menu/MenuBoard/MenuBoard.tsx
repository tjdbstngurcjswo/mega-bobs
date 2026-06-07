'use client';

import { CalendarDays, Info, MapPin } from 'lucide-react';
import { useMemo } from 'react';

import { MENU_CATEGORIES } from '@/constants/menu';
import dayjs from '@/lib/dayjs';
import { usePick } from '@/hooks/usePick';
import { useVotes } from '@/hooks/useVote';
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
  footerNoteClass,
  menuBodyClass,
  menuHeadingLocationClass,
  menuHeadingTitleClass,
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

  return (
    <section className={sectionClass}>
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="flex items-center gap-2">
          <span className={menuHeadingTitleClass}>메뉴</span>
          <span className={menuHeadingLocationClass}>
            <MapPin size={10} strokeWidth={2.5} />
            메가존 구내식당
          </span>
        </h2>
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
      <div className={menuBodyClass}>
        {dayMenus.length > 0 ? (
          dayMenus.map((menu, i) => {
            const menuKey = `${menu.date}_${menu.category}`;
            return (
              <MenuBoardCourseRow
                key={menu.category}
                menu={menu}
                index={i}
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
      {(showVote || showPick) && dayMenus.length > 0 && (
        <p className={footerNoteClass}>
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
