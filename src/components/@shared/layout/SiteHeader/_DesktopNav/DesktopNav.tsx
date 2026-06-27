import Link from 'next/link';

import { NAV_ITEMS } from '@/constants/site';

import {
  desktopComingSoonClass,
  desktopNavClass,
  desktopNavLinkClass,
} from '../SiteHeader.styles';
import NavComingSoonItem from '../_NavComingSoonItem/NavComingSoonItem';

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
          <NavComingSoonItem
            key={item.href}
            label={item.label}
            className={desktopComingSoonClass}
          />
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
