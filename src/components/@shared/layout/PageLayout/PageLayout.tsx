import { ReactNode } from 'react';

import {
  pageContentClass,
  pageDescClass,
  pageEyebrowClass,
  pageHeaderClass,
  pageMainClass,
  pageTitleClass,
} from './PageLayout.styles';

interface PageLayoutProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
}

const PageLayout = ({
  eyebrow,
  title,
  description,
  headerAction,
  children,
}: PageLayoutProps) => (
  <main className={pageMainClass}>
    <section className={pageHeaderClass}>
      <p className={pageEyebrowClass}>{eyebrow}</p>
      <div className="mt-3 flex items-center justify-between">
        <h1 className={pageTitleClass}>{title}</h1>
        {headerAction}
      </div>
      {description && <p className={pageDescClass}>{description}</p>}
    </section>
    <div className={pageContentClass}>{children}</div>
  </main>
);

export default PageLayout;
