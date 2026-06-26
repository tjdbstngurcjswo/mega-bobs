import { Bell } from 'lucide-react';
import Link from 'next/link';

import { bellDotClass, bellSpanClass } from '../SiteHeader.styles';

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

export default NoticeBell;
