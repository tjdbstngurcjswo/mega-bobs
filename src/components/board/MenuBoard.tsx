'use client';

import {useMemo} from 'react';

import {MENU_CATEGORIES} from '@/constants/menu';
import {CAFETERIA, isNextWeek, isNextWeekPublished} from '@/lib/menu-policy';
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
  const {today, selectedDate} = useDateStore();

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
    <section className="bg-surface shadow-flat border-line border">
      <div className="bg-accent text-ink flex items-center justify-between px-6 py-4">
        <h2 className="text-base font-extrabold">메뉴</h2>
        <span className="text-ink/60 text-xs font-bold">
          메가존 구내식당 · {CAFETERIA.openLabel}
        </span>
      </div>
      <DayBar />
      {dayMenus.length > 0 ? (
        dayMenus.map((menu) => <CourseRow key={menu.category} menu={menu} />)
      ) : (
        <BoardEmpty variant={emptyVariant} />
      )}
    </section>
  );
};

export default MenuBoard;
