import { Menu, X } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

import ThemeToggle from '@/components/@shared/ui/ThemeToggle';

import {
  mobileBellLinkClass,
  mobileMenuButtonClass,
} from '../SiteHeader.styles';
import NoticeBell from '../_NoticeBell/NoticeBell';

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

export default MobileControls;
