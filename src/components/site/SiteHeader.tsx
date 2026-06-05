'use client';

import {Bell} from 'lucide-react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

import noticeData from '@/../data/notices.json';
import {NAV_ITEMS} from '@/constants/site';
import dayjs from '@/lib/dayjs';
import {useHasMounted} from '@/lib/useHasMounted';
import {cn} from '@/lib/utils';
import type {NoticeData} from '@/types/notice';

const {notices} = noticeData as NoticeData;

/** 발행 후 일주일 이내 공지가 하나라도 있으면 NEW */
const hasRecentNotice = () =>
  notices.some((n) => dayjs().tz().diff(dayjs.tz(n.publishedAt), 'day') < 7);

const SiteHeader = () => {
  const pathname = usePathname();
  const mounted = useHasMounted();
  const showNoticeDot = mounted && hasRecentNotice();

  return (
    <header className="bg-board">
      <div className="mx-auto flex h-16 w-[min(880px,calc(100%-40px))] items-center gap-7">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-cream">
          MegaBobs
        </Link>
        <nav className="flex flex-1 gap-0.5 overflow-x-auto whitespace-nowrap">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                aria-disabled={item.disabled}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-semibold',
                  active
                    ? 'bg-board-2 text-white shadow-[inset_0_-2px_0_var(--color-accent)]'
                    : 'text-cream-2 hover:bg-board-2',
                  item.disabled && 'cursor-default opacity-60'
                )}
              >
                {item.label}
                {item.disabled && (
                  <span className="bg-board-2 px-1 py-px text-[9px] font-bold text-cream">
                    준비중
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/notice"
          title="공지사항"
          aria-label="공지사항"
          className="relative flex size-9 items-center justify-center text-cream"
        >
          <Bell size={18} strokeWidth={2.4} />
          {showNoticeDot && (
            <span aria-hidden className="absolute top-[7px] right-[6px] size-1.5 bg-accent" />
          )}
        </Link>
      </div>
    </header>
  );
};

export default SiteHeader;
