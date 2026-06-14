import Link from 'next/link';

import { FOOTER_LINKS, SITE_NAME } from '@/constants/site';

import {
  footerBrandNameClass,
  footerCopyrightClass,
  footerDescClass,
  footerLinkClass,
} from './SiteFooter.styles';

const SiteFooter = () => (
  <footer className="mt-8">
    <div className="mx-auto w-[min(880px,calc(100%-40px))] py-6">
      <div className="flex flex-col items-center gap-4 text-center min-[560px]:flex-row min-[560px]:items-center min-[560px]:justify-between min-[560px]:gap-0 min-[560px]:text-left">
        {/* 브랜드 단 */}
        <div className="flex flex-col items-center gap-1 min-[560px]:flex-row min-[560px]:gap-5">
          <span className={footerBrandNameClass}>{SITE_NAME}</span>
          <p className={footerDescClass}>
            메가존 직원을 위한 구내식당 메뉴 서비스
          </p>
        </div>
        {/* 링크 단 + 저작권 단 */}
        <div className="flex flex-col items-center gap-2 min-[560px]:flex-row min-[560px]:flex-wrap min-[560px]:items-center min-[560px]:gap-x-5 min-[560px]:gap-y-2">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 min-[560px]:contents">
            {FOOTER_LINKS.map((l) => (
              <Link key={l.label} href={l.href} className={footerLinkClass}>
                {l.label}
              </Link>
            ))}
          </div>
          <span className={footerCopyrightClass}>© 2026 {SITE_NAME}</span>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
