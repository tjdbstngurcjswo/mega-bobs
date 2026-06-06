import Link from 'next/link';

import {HOME_ENTRIES} from '@/constants/site';

const EntryInner = ({no, label, desc, disabled}: {no: string; label: string; desc: string; disabled?: boolean}) => (
  <>
    <span className="w-[26px] text-[13px] font-black text-accent-text">{no}</span>
    <span className="flex-1">
      <b className="block text-sm font-extrabold">
        {label}
        {disabled && (
          <i className="bg-down-soft text-down ml-1.5 px-1.5 py-0.5 align-[2px] text-[9px] font-extrabold not-italic">
            준비 중
          </i>
        )}
      </b>
      <span className="mt-0.5 block text-[10.5px] text-muted">{desc}</span>
    </span>
    <span aria-hidden className="text-[#C9C9C6]">
      ›
    </span>
  </>
);

const ENTRY_CLASS = 'flex min-h-[62px] flex-1 items-center gap-3.5 bg-surface px-4 shadow-[var(--shadow-card)]';

const HomeSide = () => (
  <aside className="flex flex-col gap-4">
    <div className="bg-surface p-6 shadow-[var(--shadow-card)]">
      <h3 className="text-[14px] font-bold text-ink-2">오늘 뭐 먹지?</h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
        구내식당과 지정타 맛집 중에서
        <br />
        점심 메뉴를 골라드려요
      </p>
      <button
        disabled
        className="mt-4 w-full cursor-default bg-down-soft py-2.5 text-[12.5px] font-semibold text-muted disabled:opacity-60"
      >
        랜덤 추천 받기 (준비 중)
      </button>
    </div>
    {HOME_ENTRIES.length > 0 && (
      <div className="flex flex-1 flex-col gap-2.5">
        {HOME_ENTRIES.map((entry) =>
          entry.disabled ? (
            <div key={entry.no} aria-disabled="true" className={`${ENTRY_CLASS} cursor-default`}>
              <EntryInner {...entry} />
            </div>
          ) : (
            <Link key={entry.no} href={entry.href} className={ENTRY_CLASS}>
              <EntryInner {...entry} />
            </Link>
          )
        )}
      </div>
    )}
  </aside>
);

export default HomeSide;
