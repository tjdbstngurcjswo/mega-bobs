'use client';

import { Bell, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { NAV_ITEMS, SITE_NAME } from '@/constants/site';
import { getAnnouncements } from '@/api/getAnnouncements';
import { hasNewAnnouncement } from '@/utils/announcementPolicy';
import { useHasMounted } from '@/hooks/useHasMounted';

import {
  bellDotClass,
  bellSpanClass,
  desktopBellLinkClass,
  desktopNavClass,
  desktopNavLinkClass,
  headerClass,
  logoLinkClass,
  mobileBellLinkClass,
  mobileMenuButtonClass,
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
          <Link href="/" className={logoLinkClass}>
            {SITE_NAME}
          </Link>

          <nav className={desktopNavClass}>
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={desktopNavLinkClass(active)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* 데스크톱 벨 */}
          <Link
            href="/notice"
            title="공지사항"
            aria-label="공지사항"
            className={desktopBellLinkClass}
          >
            <span className={bellSpanClass(showNoticeDot)}>
              <Bell size={17} strokeWidth={2.2} />
            </span>
            {showNoticeDot && (
              <span aria-hidden className={bellDotClass} />
            )}
          </Link>

          {/* 모바일 우측 */}
          <div className="ml-auto flex items-center gap-1 min-[641px]:hidden">
            <Link
              href="/notice"
              title="공지사항"
              aria-label="공지사항"
              className={mobileBellLinkClass}
            >
              <span className={bellSpanClass(showNoticeDot)}>
                <Bell size={17} strokeWidth={2.2} />
              </span>
              {showNoticeDot && (
                <span aria-hidden className={bellDotClass} />
              )}
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
              onClick={() => setMenuOpen((v) => !v)}
              className={mobileMenuButtonClass}
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
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={mobileNavLinkClass(active)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default SiteHeader;
