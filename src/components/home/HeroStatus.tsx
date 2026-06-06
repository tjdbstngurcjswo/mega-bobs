'use client';

import {Clock, Moon, Sun, Utensils} from 'lucide-react';
import {useEffect, useState} from 'react';

import dayjs from '@/lib/dayjs';
import {CAFETERIA_CLOSE_MIN, CAFETERIA_LABEL, CAFETERIA_OPEN_MIN} from '@/lib/menu-policy';
import {formatYYYYMMDD} from '@/lib/utils';
import {MenuType} from '@/types/menu';

type Status = {icon: React.ElementType; text: string};

const nextWorkdayKey = (from: dayjs.Dayjs): string => {
  const dow = from.day();
  const ahead = dow === 5 ? 3 : dow === 6 ? 2 : 1;
  return formatYYYYMMDD(from.add(ahead, 'day'));
};

const getStatus = (menus: MenuType[], now: dayjs.Dayjs): Status => {
  const dow = now.day();
  const min = now.hour() * 60 + now.minute();
  const hasMenu = (key: string) => menus.some((m) => m.date === key && m.items.length > 0);

  if (dow === 0 || dow === 6) {
    return hasMenu(nextWorkdayKey(now))
      ? {icon: Sun, text: '주말이에요, 월요일에 만나요!'}
      : {icon: Sun, text: '편안한 주말 되세요!'};
  }

  // 평일인데 오늘 메뉴 없음 → 공휴일
  const todayKey = formatYYYYMMDD(now);
  if (!hasMenu(todayKey)) {
    const nwKey = nextWorkdayKey(now);
    return hasMenu(nwKey)
      ? {icon: Sun, text: '오늘은 공휴일이에요. 내일 만나요!'}
      : {icon: Sun, text: '오늘은 공휴일이에요.'};
  }

  if (min < CAFETERIA_OPEN_MIN) return {icon: Clock, text: '잠시 후 운영 시작이에요.'};
  if (min < CAFETERIA_CLOSE_MIN) return {icon: Utensils, text: `지금 운영 중이에요! ${CAFETERIA_LABEL}`};

  if (dow === 5) {
    return hasMenu(nextWorkdayKey(now))
      ? {icon: Moon, text: '오늘 점심은 끝났어요. 월요일에 만나요!'}
      : {icon: Sun, text: '즐거운 주말 되세요!'};
  }

  const tomorrowKey = formatYYYYMMDD(now.add(1, 'day'));
  return hasMenu(tomorrowKey)
    ? {icon: Moon, text: '오늘 점심은 끝났어요. 내일 만나요!'}
    : {icon: Moon, text: '오늘 점심은 끝났어요.'};
};

const HeroStatus = ({menus}: {menus: MenuType[]}) => {
  const [status, setStatus] = useState<Status>(() => getStatus(menus, dayjs().tz()));

  useEffect(() => {
    const update = () => setStatus(getStatus(menus, dayjs().tz()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [menus]);

  const Icon = status.icon;
  const isOperating = status.icon === Utensils;

  return (
    <span
      key={status.text}
      suppressHydrationWarning
      className="inline-flex items-center gap-2"
    >
      <Icon
        size={26}
        strokeWidth={2}
        className="shrink-0"
        style={{
          animation: isOperating
            ? 'fadeUp 0.35s ease both, softPulse 2.4s ease-in-out 0.35s infinite'
            : 'fadeUp 0.35s ease both',
        }}
      />
      <span style={{animation: 'fadeUp 0.4s ease 0.08s both'}}>
        {status.text}
      </span>
    </span>
  );
};

export default HeroStatus;
