import Link from 'next/link';

import { NAV_ITEMS } from '@/constants/site';

import {
  comingSoonBadgeClass,
  desktopComingSoonClass,
  desktopNavClass,
  desktopNavLinkClass,
} from '../SiteHeader.styles';

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

export default DesktopNav;
