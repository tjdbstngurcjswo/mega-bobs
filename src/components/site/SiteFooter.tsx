import Link from 'next/link';

import {FOOTER_LINKS} from '@/constants/site';

const SiteFooter = () => (
  <footer className="mt-16 bg-board text-cream-2">
    <div className="mx-auto flex w-[min(880px,calc(100%-40px))] flex-col gap-3 py-7">
      <div className="flex items-center gap-2 text-[15px] font-extrabold text-cream">
        <span aria-hidden className="inline-block size-[9px] bg-accent" />
        메가밥스
        <span className="ml-1 text-xs font-medium text-cream-2">메가존 구내식당 비공식 점심 허브</span>
      </div>
      <div className="flex flex-wrap gap-4 text-[12.5px]">
        {FOOTER_LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="border-b border-[#3A3A3A] pb-0.5 font-bold text-cream"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className="text-[11.5px] leading-relaxed text-[#6E6E6E]">
        © 2026 megabobs · 메뉴는 매주 목요일 업데이트 · 정보 오류 제보 환영
      </div>
    </div>
  </footer>
);

export default SiteFooter;
