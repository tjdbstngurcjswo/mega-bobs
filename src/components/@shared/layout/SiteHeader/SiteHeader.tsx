'use client';

import { Bell, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { NAV_ITEMS } from '@/constants/site';
import { getAnnouncements } from '@/api/getAnnouncements';
import { hasNewAnnouncement } from '@/utils/announcementPolicy';
import { useHasMounted } from '@/hooks/useHasMounted';

import {
  bellSpanClass,
  desktopNavLinkClass,
  headerClass,
  mobileNavLinkClass,
  mobileOverlayClass,
} from './SiteHeader.styles';

const SiteHeader = () => {
  const pathname = usePathname();
  const mounted = useHasMounted();
  const announcements = useMemo(() => getAnnouncements(), []);
  const showNoticeDot = useMemo(
    () => mounted && hasNewAnnouncement(announcements),
    [mounted, announcements]
  );
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className={headerClass(scrolled, menuOpen)}>
        <div className="mx-auto flex h-14 w-[min(880px,calc(100%-40px))] items-center gap-7">
          <Link
            href="/"
            className="text-ink text-[17px] font-extrabold tracking-tight"
          >
            MegaBobs
          </Link>

          {/* 데스크톱 nav */}
          <nav className="flex flex-1 gap-0.5 overflow-x-auto whitespace-nowrap max-[640px]:hidden">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.disabled ? '#' : item.href}
                  aria-disabled={item.disabled}
                  className={desktopNavLinkClass(active, item.disabled)}
                >
                  {item.label}
                  {item.disabled && (
                    <span className="bg-down-soft text-down px-1 py-px text-[9px] font-bold">
                      준비중
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 데스크톱 벨 */}
          <Link
            href="/notice"
            title="공지사항"
            aria-label="공지사항"
            className="text-ink-2 relative flex size-9 items-center justify-center max-[640px]:hidden"
          >
            <span className={bellSpanClass(showNoticeDot)}>
              <Bell size={17} strokeWidth={2.2} />
            </span>
            {showNoticeDot && (
              <span
                aria-hidden
                className="bg-accent absolute top-[7px] right-[6px] size-1.5"
              />
            )}
          </Link>

          {/* 모바일 우측 */}
          <div className="ml-auto flex items-center gap-1 min-[641px]:hidden">
            <Link
              href="/notice"
              title="공지사항"
              aria-label="공지사항"
              className="text-ink-2 relative flex size-11 items-center justify-center"
            >
              <span className={bellSpanClass(showNoticeDot)}>
                <Bell size={17} strokeWidth={2.2} />
              </span>
              {showNoticeDot && (
                <span
                  aria-hidden
                  className="bg-accent absolute top-[7px] right-[6px] size-1.5"
                />
              )}
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
              onClick={() => setMenuOpen((v) => !v)}
              className="text-ink-2 flex size-11 items-center justify-center"
            >
              {menuOpen ? (
                <X size={20} strokeWidth={2} />
              ) : (
                <Menu size={20} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 — header 밖 fixed, stacking context 영향 없음 */}
      <div className={mobileOverlayClass(menuOpen)}>
        <nav className="mx-auto flex w-[min(880px,calc(100%-40px))] flex-col pt-1 pb-4">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                aria-disabled={item.disabled}
                onClick={() => setMenuOpen(false)}
                className={mobileNavLinkClass(active, item.disabled)}
              >
                {item.label}
                {item.disabled && (
                  <span className="bg-down-soft text-down px-1.5 py-0.5 text-[9px] font-bold">
                    준비중
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default SiteHeader;
