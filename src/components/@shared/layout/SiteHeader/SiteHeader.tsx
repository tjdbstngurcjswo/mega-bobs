'use client';

import { Bell, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    if (!mounted) return;
    const activeIdx = NAV_ITEMS.findIndex((item) => pathname === item.href);
    if (activeIdx < 0) { setIndicator(null); return; }
    const link = linkRefs.current[activeIdx];
    const nav = navRef.current;
    if (!link || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    setIndicator({ left: linkRect.left - navRect.left, width: linkRect.width });
  }, [mounted, pathname]);

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

          <nav ref={navRef} className={desktopNavClass}>
            {NAV_ITEMS.map((item, i) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={(el) => { linkRefs.current[i] = el; }}
                  className={desktopNavLinkClass(active)}
                >
                  {item.label}
                </Link>
              );
            })}
            {indicator && (
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 h-0.5 bg-accent transition-all duration-250 ease-out"
                style={{ left: indicator.left, width: indicator.width }}
              />
            )}
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
