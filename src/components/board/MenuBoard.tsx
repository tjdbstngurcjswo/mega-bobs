'use client';

import {CalendarDays, MapPin} from 'lucide-react';
import {useMemo} from 'react';

import {cn} from '@/lib/utils';

import {MENU_CATEGORIES} from '@/constants/menu';
import {isNextWeek, isNextWeekPublished} from '@/lib/menu-policy';
import {formatYYYYMMDD} from '@/lib/utils';
import {useDateStore} from '@/store/useDateStore';
import {MenuType} from '@/types/menu';

import BoardEmpty from './BoardEmpty';
import CourseRow from './CourseRow';
import DayBar from './DayBar';

interface MenuBoardProps {
  /** 서버에서 페치한 ±1주 메뉴 — SSR 시점에 바로 렌더해 하이드레이션 시프트를 방지 */
  menus: MenuType[];
}

const MenuBoard = ({menus}: MenuBoardProps) => {
  const {today, selectedDate, setSelectedDate} = useDateStore();

  const dayMenus = useMemo(() => {
    const key = formatYYYYMMDD(selectedDate);
    const found = menus.filter((m) => m.date === key && m.items.length > 0);
    // 코스 순서 고정: 코스1 → 코스2 → 테이크아웃
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
      <div className="flex items-center justify-between px-6 py-4 border-b border-line">
        <h2 className="flex items-center gap-2">
          <span className="text-[14px] font-extrabold tracking-wide text-ink">메뉴</span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted">
            <MapPin size={10} strokeWidth={2.5} />
            메가존 구내식당
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setSelectedDate(today)}
          aria-hidden={selectedDate.isSame(today, 'day')}
          className={cn(
            'flex items-center gap-1.5 border border-accent/50 bg-accent-soft px-3 py-1 text-[11px] font-bold text-accent-text transition-opacity hover:opacity-70',
            selectedDate.isSame(today, 'day') ? 'invisible' : 'visible'
          )}
        >
          <CalendarDays size={11} strokeWidth={2.5} />
          오늘
        </button>
      </div>
      <DayBar />
      {dayMenus.length > 0 ? (
        dayMenus.map((menu, i) => <CourseRow key={menu.category} menu={menu} index={i} />)
      ) : (
        <BoardEmpty variant={emptyVariant} />
      )}
    </section>
  );
};

export default MenuBoard;
