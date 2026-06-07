import Link from 'next/link';

import { FOOTER_LINKS } from '@/constants/site';

import {
  footerBrandNameClass,
  footerCopyrightClass,
  footerDescClass,
  footerLinkClass,
} from './SiteFooter.styles';

const SiteFooter = () => (
  <footer className="mt-16">
    <div className="mx-auto w-[min(880px,calc(100%-40px))] py-6">
      <div className="flex items-center justify-between gap-x-6 gap-y-3 max-[560px]:flex-col max-[560px]:items-center">
        <div className="flex items-center gap-5 max-[560px]:flex-col max-[560px]:items-center max-[560px]:gap-1">
          <span className={footerBrandNameClass}>MegaBobs</span>
          <p className={footerDescClass}>
            메가존 임직원을 위한 구내식당 메뉴 서비스
          </p>
        </div>
        <div className="flex items-center gap-5">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className={footerLinkClass}>
              {l.label}
            </Link>
          ))}
          <span className={footerCopyrightClass}>© 2026 MegaBobs</span>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
