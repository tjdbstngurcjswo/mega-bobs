'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { getNotices } from '@/api/getNotices';
import ThemeToggle from '@/components/@shared/ui/ThemeToggle';
import { SITE_NAME } from '@/constants/site';
import { useHasMounted } from '@/hooks/useHasMounted';
import {
  getReadNoticeIds,
  hasNewNotice,
  NOTICE_READ_EVENT,
} from '@/utils/noticePolicy';

import { CONTENT_WIDTH_CLASS } from '../PageLayout/PageLayout.styles';

import DesktopNav from './_DesktopNav/DesktopNav';
import MobileControls from './_MobileControls/MobileControls';
import MobileOverlay from './_MobileOverlay/MobileOverlay';
import NoticeBell from './_NoticeBell/NoticeBell';
import {
  desktopBellLinkClass,
  headerClass,
  logoLinkClass,
} from './SiteHeader.styles';

const SiteHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useHasMounted();
  const notices = useMemo(() => getNotices(), []);
  const [readIds, setReadIds] = useState<string[] | null>(null);
  const showNoticeDot = useMemo(
    () => mounted && readIds !== null && hasNewNotice(notices, readIds),
    [mounted, notices, readIds]
  );
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    setReadIds(getReadNoticeIds());
  }, [mounted, pathname]);

  useEffect(() => {
    if (!mounted) return;
    const sync = () => setReadIds(getReadNoticeIds());
    window.addEventListener(NOTICE_READ_EVENT, sync);
    return () => window.removeEventListener(NOTICE_READ_EVENT, sync);
  }, [mounted]);

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
        <div
          className={`mx-auto flex h-14 ${CONTENT_WIDTH_CLASS} items-center gap-7`}
        >
          <Link href="/" className={logoLinkClass}>
            {SITE_NAME}
          </Link>

          <DesktopNav pathname={pathname} prefetch={router.prefetch} />

          <div className="max-[640px]:hidden">
            <ThemeToggle />
          </div>

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
