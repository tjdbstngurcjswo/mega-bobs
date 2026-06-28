import { comingSoonBadgeClass } from '../SiteHeader.styles';

const NavComingSoonItem = ({
  label,
  className,
}: {
  label: string;
  className: string;
}) => (
  <span className={className}>
    {label}
    <span className={comingSoonBadgeClass}>준비중</span>
  </span>
);

export default NavComingSoonItem;
