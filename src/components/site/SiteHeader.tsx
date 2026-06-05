'use client';

import {Bell} from 'lucide-react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

import {NAV_ITEMS} from '@/constants/site';
import {cn} from '@/lib/utils';

const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <header className="bg-board">
      <div className="mx-auto flex h-16 w-[min(880px,calc(100%-40px))] items-center gap-7">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-cream">
          <span aria-hidden className="inline-block size-[11px] bg-accent" />
          메가밥스
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
                  'px-3 py-2 text-sm font-semibold',
                  active
                    ? 'bg-board-2 text-white shadow-[inset_0_-2px_0_var(--color-accent)]'
                    : 'text-cream-2 hover:bg-board-2',
                  item.disabled && 'cursor-default opacity-50'
                )}
              >
                {item.label}
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
          <span aria-hidden className="absolute top-[7px] right-[6px] size-1.5 bg-accent" />
        </Link>
      </div>
    </header>
  );
};

export default SiteHeader;
