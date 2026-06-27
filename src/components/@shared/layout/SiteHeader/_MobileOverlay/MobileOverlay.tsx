import { Check } from 'lucide-react';
import Link from 'next/link';
import type { Dispatch, SetStateAction } from 'react';

import { NAV_ITEMS } from '@/constants/site';

import { CONTENT_WIDTH_CLASS } from '../../PageLayout/PageLayout.styles';
import NavComingSoonItem from '../_NavComingSoonItem/NavComingSoonItem';
import {
  mobileComingSoonClass,
  mobileNavLinkClass,
  mobileOverlayClass,
} from '../SiteHeader.styles';

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
    <nav className={`mx-auto flex ${CONTENT_WIDTH_CLASS} flex-col pt-1 pb-4`}>
      {NAV_ITEMS.map((item) => {
        if (item.comingSoon) {
          return (
            <NavComingSoonItem
              key={item.href}
              label={item.label}
              className={mobileComingSoonClass}
            />
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

export default MobileOverlay;
