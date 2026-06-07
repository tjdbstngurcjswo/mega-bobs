'use client';

import { Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';

import dayjs from '@/lib/dayjs';
import { getHeroStatus, HeroStatusState } from './HeroStatus.utils';
import { MenuType } from '@/models/menu';

const STATUS_TAG: Record<
  HeroStatusState['variant'],
  { label: string; tagClass: string; dotClass: string }
> = {
  open: {
    label: '운영 중',
    tagClass: 'bg-accent text-ink',
    dotClass: 'bg-ink/25',
  },
  upcoming: {
    label: '준비 중',
    tagClass: 'bg-accent-soft text-accent-text',
    dotClass: 'bg-accent',
  },
  closed: {
    label: '마감',
    tagClass: 'bg-down-soft text-down',
    dotClass: 'bg-down/50',
  },
};

const HeroStatus = ({ menus }: { menus: MenuType[] }) => {
  const [status, setStatus] = useState<HeroStatusState>(() =>
    getHeroStatus(menus, dayjs().tz())
  );

  useEffect(() => {
    const update = () => setStatus(getHeroStatus(menus, dayjs().tz()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [menus]);

  const Icon = status.icon;
  const isOperating = status.variant === 'open';
  const tag = STATUS_TAG[status.variant];

  return (
    <span
      key={status.text}
      suppressHydrationWarning
      className="inline-flex items-center gap-2.5"
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
      <span style={{ animation: 'fadeUp 0.4s ease 0.08s both' }}>
        {status.text}
      </span>
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold ${tag.tagClass}`}
        style={{ animation: 'fadeUp 0.3s ease 0.1s both' }}
      >
        <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${tag.dotClass}`} />
        {tag.label}
      </span>
    </span>
  );
};

export default HeroStatus;
