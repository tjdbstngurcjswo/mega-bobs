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
  children: ReactNode;
}

const PageLayout = ({ eyebrow, title, description, children }: PageLayoutProps) => (
  <main className={pageMainClass}>
    <section className={pageHeaderClass}>
      <p className={pageEyebrowClass}>{eyebrow}</p>
      <h1 className={pageTitleClass}>{title}</h1>
      {description && <p className={pageDescClass}>{description}</p>}
    </section>
    <div className={pageContentClass}>{children}</div>
  </main>
);

export default PageLayout;
