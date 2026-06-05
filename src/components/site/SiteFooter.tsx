import Link from 'next/link';

import {FOOTER_LINKS} from '@/constants/site';

const SiteFooter = () => (
  <footer className="mt-16 bg-board text-cream-2">
    <div className="mx-auto flex w-[min(880px,calc(100%-40px))] flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3.5 text-[11.5px]">
      <span className="font-extrabold text-cream">MegaBobs</span>
      <div className="flex items-center gap-4">
        {FOOTER_LINKS.map((l) => (
          <Link key={l.label} href={l.href} className="font-bold text-cream">
            {l.label}
          </Link>
        ))}
        <span className="text-[#6E6E6E]">© 2026 megabobs</span>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
