'use client';

import { Bell, Check, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getNotices } from '@/api/getNotices';
import ThemeToggle from '@/components/@shared/ui/ThemeToggle';
import { NAV_ITEMS, SITE_NAME } from '@/constants/site';
import { useHasMounted } from '@/hooks/useHasMounted';
import { getReadNoticeIds, hasNewNotice } from '@/utils/noticePolicy';

import {
  bellDotClass,
  bellSpanClass,
  comingSoonBadgeClass,
  desktopBellLinkClass,
  desktopComingSoonClass,
  desktopNavClass,
  desktopNavLinkClass,
  headerClass,
  logoLinkClass,
  mobileComingSoonClass,
  mobileBellLinkClass,
  mobileMenuButtonClass,
  mobileNavLinkClass,
  mobileOverlayClass,
} from './SiteHeader.styles';

const NoticeBell = ({
  showNoticeDot,
  className,
  prefetch,
}: {
  showNoticeDot: boolean;
  className: string;
  prefetch: (href: string) => void;
}) => (
  <Link
    href="/notice"
    title="공지사항"
    aria-label="공지사항"
    onMouseEnter={() => prefetch('/notice')}
    className={className}
  >
    <span className={bellSpanClass(showNoticeDot)}>
      <Bell size={17} strokeWidth={2.2} />
    </span>
    {showNoticeDot && <span aria-hidden className={bellDotClass} />}
  </Link>
);

const DesktopNav = ({
  pathname,
  prefetch,
}: {
  pathname: string;
  prefetch: (href: string) => void;
}) => (
  <nav className={desktopNavClass}>
    {NAV_ITEMS.map((item) => {
      if (item.comingSoon) {
        return (
          <span key={item.href} className={desktopComingSoonClass}>
            {item.label}
            <span className={comingSoonBadgeClass}>준비중</span>
          </span>
        );
      }
      const active = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          onMouseEnter={() => prefetch(item.href)}
          className={desktopNavLinkClass(active)}
        >
          {item.label}
        </Link>
      );
    })}
  </nav>
);

const MobileControls = ({
  menuOpen,
  setMenuOpen,
  showNoticeDot,
  prefetch,
}: {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  showNoticeDot: boolean;
  prefetch: (href: string) => void;
}) => (
  <div className="ml-auto flex items-center gap-1 min-[641px]:hidden">
    <NoticeBell
      showNoticeDot={showNoticeDot}
      className={mobileBellLinkClass}
      prefetch={prefetch}
    />
    <ThemeToggle />
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
);

const MobileOverlay = ({
  menuOpen,
  pathname,
  setMenuOpen,
  prefetch,
}: {
  menuOpen: boolean;
  pathname: string;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  prefetch: (href: string) => void;
}) => (
  <div className={mobileOverlayClass(menuOpen)}>
    <nav className="mx-auto flex w-[min(880px,calc(100%-40px))] flex-col pt-1 pb-4">
      {NAV_ITEMS.map((item) => {
        if (item.comingSoon) {
          return (
            <span key={item.href} className={mobileComingSoonClass}>
              {item.label}
              <span className={comingSoonBadgeClass}>준비중</span>
            </span>
          );
        }
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            onMouseEnter={() => prefetch(item.href)}
            className={mobileNavLinkClass(active)}
          >
            {item.label}
            {active && <Check size={16} strokeWidth={2.5} aria-hidden />}
          </Link>
        );
      })}
    </nav>
  </div>
);

const SiteHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useHasMounted();
  const notices = useMemo(() => getNotices(), []);
  const [readIds, setReadIds] = useState<string[]>([]);
  const showNoticeDot = useMemo(
    () => mounted && hasNewNotice(notices, readIds),
    [mounted, notices, readIds]
  );
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    setReadIds(getReadNoticeIds());
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

          <DesktopNav pathname={pathname} prefetch={router.prefetch} />

          <ThemeToggle />

          {/* 데스크톱 벨 */}
          <NoticeBell
            showNoticeDot={showNoticeDot}
            className={desktopBellLinkClass}
            prefetch={router.prefetch}
          />

          {/* 모바일 우측 */}
          <MobileControls
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            showNoticeDot={showNoticeDot}
            prefetch={router.prefetch}
          />
        </div>
      </header>

      {/* 모바일 메뉴 — header 밖 fixed, stacking context 영향 없음 */}
      <MobileOverlay
        menuOpen={menuOpen}
        pathname={pathname}
        setMenuOpen={setMenuOpen}
        prefetch={router.prefetch}
      />
    </>
  );
};

export default SiteHeader;
