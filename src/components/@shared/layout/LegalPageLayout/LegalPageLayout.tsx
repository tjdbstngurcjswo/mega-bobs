import { LegalPageLayoutProps } from './LegalPageLayout.types';
import {
  legalContainerClass,
  legalContentClass,
  legalEyebrowClass,
  legalMainClass,
  legalTitleClass,
  legalUpdatedAtClass,
  tocLinkClass,
  tocListClass,
  tocTitleClass,
  tocWrapClass,
} from './LegalPageLayout.styles';

const LegalPageLayout = ({
  title,
  updatedAt,
  tocItems,
  children,
}: LegalPageLayoutProps) => (
  <main className={legalMainClass}>
    <div className={legalContainerClass}>
      <div className={legalContentClass}>
        <p className={legalEyebrowClass}>법적 고지</p>
        <h1 className={legalTitleClass}>{title}</h1>
        <p className={legalUpdatedAtClass}>최종 업데이트: {updatedAt}</p>

        <nav aria-label="목차" className={tocWrapClass}>
          <p className={tocTitleClass}>목차</p>
          <ol className={tocListClass}>
            {tocItems.map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={tocLinkClass}>
                  {i + 1}. {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {children}
      </div>
    </div>
  </main>
);

export default LegalPageLayout;
