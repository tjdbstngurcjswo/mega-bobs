'use client';

import {Utensils} from 'lucide-react';
import {useEffect, useState} from 'react';

import dayjs from '@/lib/dayjs';
import {getHeroStatus, HeroStatusState} from './hero-status';
import {MenuType} from '@/types/menu';

const HeroStatus = ({menus}: {menus: MenuType[]}) => {
  const [status, setStatus] = useState<HeroStatusState>(() => getHeroStatus(menus, dayjs().tz()));

  useEffect(() => {
    const update = () => setStatus(getHeroStatus(menus, dayjs().tz()));
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
