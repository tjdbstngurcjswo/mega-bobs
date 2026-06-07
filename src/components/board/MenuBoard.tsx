'use client';

import {CalendarDays, Info, MapPin} from 'lucide-react';
import {useMemo} from 'react';

import {CATEGORY_TO_PICK, MENU_CATEGORIES} from '@/constants/menu';
import dayjs from '@/lib/dayjs';
import {usePick} from '@/lib/hooks/usePick';
import {useVotes} from '@/lib/hooks/useVote';
import {isAfterClose, isNextWeek, isNextWeekPublished} from '@/lib/menu-policy';
import {useHasMounted} from '@/lib/useHasMounted';
import {cn, formatYYYYMMDD} from '@/lib/utils';
import {useDateStore} from '@/store/useDateStore';
import {MenuBoardProps} from '@/types/board';

import BoardEmpty from './BoardEmpty';
import CourseRow from './CourseRow';
import DayBar from './DayBar';

const MenuBoard = ({menus}: MenuBoardProps) => {
  const {today, selectedDate, setSelectedDate} = useDateStore();
  const mounted = useHasMounted();
  const dateStr = formatYYYYMMDD(selectedDate);
  const hasMenus = useMemo(
    () => menus.some((m) => m.date === dateStr && m.items.length > 0),
    [menus, dateStr]
  );
  const {voteMap, submitVote, isSubmitting} = useVotes(dateStr, {enabled: hasMenus});
  const {myPick, counts, submitPick, isSubmitting: isSubmittingPick} = usePick(dateStr, {enabled: hasMenus});
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
        dayMenus.map((menu, i) => {
          const menuKey = `${menu.date}_${menu.category}`;
          const pickType = CATEGORY_TO_PICK[menu.category];
          return (
            <CourseRow
              key={menu.category}
              menu={menu}
              index={i}
              showVote={showVote}
              voteResult={voteMap[menuKey]}
              onVote={(type) => submitVote(menuKey, type)}
              isSubmitting={isSubmitting}
              showPick={showPick && !!pickType}
              pickCount={pickType ? counts[pickType] : 0}
              isPicked={!!pickType && myPick === pickType}
              onPick={() => pickType && submitPick(pickType)}
              isSubmittingPick={isSubmittingPick}
            />
          );
        })
      ) : (
        <BoardEmpty variant={emptyVariant} date={dateStr} isToday={isToday} isPast={isPast} />
      )}
      {(showVote || showPick) && dayMenus.length > 0 && (
        <p className="flex items-center gap-1.5 px-5 py-2.5 text-[10px] leading-relaxed text-muted">
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
