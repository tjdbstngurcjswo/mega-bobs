import type { ElementType } from 'react';

import { Clock, Moon, Sun, Utensils } from 'lucide-react';

import dayjs from '@/lib/dayjs';
import {
  CAFETERIA_CLOSE_MIN,
  CAFETERIA_LABEL,
  CAFETERIA_OPEN_MIN,
} from '@/constants/cafeteria';
import { formatYYYYMMDD } from '@/utils/date';
import { MenuType } from '@/models/menu';

export type HeroStatusState = {
  icon: ElementType;
  text: string;
  variant: 'open' | 'upcoming' | 'closed';
};

const nextWorkdayKey = (from: dayjs.Dayjs): string => {
  const dow = from.day();
  const ahead = dow === 5 ? 3 : dow === 6 ? 2 : 1;
  return formatYYYYMMDD(from.add(ahead, 'day'));
};

export const getHeroStatus = (
  menus: MenuType[],
  now: dayjs.Dayjs
): HeroStatusState => {
  const dow = now.day();
  const min = now.hour() * 60 + now.minute();
  const hasMenu = (key: string) =>
    menus.some((m) => m.date === key && m.items.length > 0);

  if (dow === 0 || dow === 6) {
    return hasMenu(nextWorkdayKey(now))
      ? { icon: Sun, text: '주말이에요, 월요일에 만나요!', variant: 'closed' }
      : { icon: Sun, text: '편안한 주말 되세요!', variant: 'closed' };
  }

  const todayKey = formatYYYYMMDD(now);
  if (!hasMenu(todayKey)) {
    const nwKey = nextWorkdayKey(now);
    const nextLabel = dow === 5 ? '월요일에 만나요!' : '내일 만나요!';
    return hasMenu(nwKey)
      ? { icon: Sun, text: `오늘은 공휴일이에요. ${nextLabel}`, variant: 'closed' }
      : { icon: Sun, text: '오늘은 공휴일이에요.', variant: 'closed' };
  }

  if (min < CAFETERIA_OPEN_MIN)
    return { icon: Clock, text: '잠시 후 운영 시작이에요.', variant: 'upcoming' };
  if (min < CAFETERIA_CLOSE_MIN)
    return {
      icon: Utensils,
      text: `지금 운영 중이에요! ${CAFETERIA_LABEL}`,
      variant: 'open',
    };

  if (dow === 5) {
    return hasMenu(nextWorkdayKey(now))
      ? { icon: Moon, text: '오늘 점심은 끝났어요. 월요일에 만나요!', variant: 'closed' }
      : { icon: Sun, text: '즐거운 주말 되세요!', variant: 'closed' };
  }

  const tomorrowKey = formatYYYYMMDD(now.add(1, 'day'));
  return hasMenu(tomorrowKey)
    ? { icon: Moon, text: '오늘 점심은 끝났어요. 내일 만나요!', variant: 'closed' }
    : { icon: Moon, text: '오늘 점심은 끝났어요.', variant: 'closed' };
};
