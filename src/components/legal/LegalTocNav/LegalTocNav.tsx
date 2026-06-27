import {
  tocLinkClass,
  tocListClass,
  tocTitleClass,
  tocWrapClass,
} from '@/app/legal.styles';

type TocItem = { id: string; label: string };

const LegalTocNav = ({ items }: { items: TocItem[] }) => (
  <nav aria-label="목차" className={tocWrapClass}>
    <p className={tocTitleClass}>목차</p>
    <ol className={tocListClass}>
      {items.map((item, i) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className={tocLinkClass}>
            {i + 1}. {item.label}
          </a>
        </li>
      ))}
    </ol>
  </nav>
);

export default LegalTocNav;
