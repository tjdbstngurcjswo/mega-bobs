import Link from 'next/link';

import { FOOTER_LINKS, SITE_NAME } from '@/constants/site';

import {
  footerBrandNameClass,
  footerCopyrightClass,
  footerDescClass,
  footerLinkClass,
} from './SiteFooter.styles';

const SiteFooter = () => (
  <footer className="mt-16">
    <div className="mx-auto w-[min(880px,calc(100%-40px))] py-6">
      <div className="flex flex-col gap-3 min-[560px]:flex-row min-[560px]:items-center min-[560px]:justify-between">
        <div className="flex items-center gap-5">
          <span className={footerBrandNameClass}>{SITE_NAME}</span>
          <p className={footerDescClass}>
            메가존 직원을 위한 구내식당 메뉴 서비스
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className={footerLinkClass}>
              {l.label}
            </Link>
          ))}
          <span className={footerCopyrightClass}>© 2026 {SITE_NAME}</span>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
