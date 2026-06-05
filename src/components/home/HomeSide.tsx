import Link from 'next/link';

import {HOME_ENTRIES} from '@/constants/site';

const HomeSide = () => (
  <aside className="flex flex-col gap-4">
    <div className="relative overflow-hidden bg-board p-5 text-cream">
      <span
        aria-hidden
        className="absolute right-3 -bottom-7 text-[110px] leading-none font-black text-cream opacity-10"
      >
        ?
      </span>
      <h3 className="text-lg font-extrabold">오늘 뭐 먹지?</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-cream-2">
        구내식당과 지정타 맛집 중에서
        <br />
        점심 메뉴를 골라드려요
      </p>
      {/* 랜덤 추천 동작은 플랜 ④(맛집 데이터) 이후 활성화 */}
      <button
        disabled
        className="relative mt-4 w-full cursor-default bg-accent py-3 text-[15px] font-extrabold text-ink disabled:opacity-60"
      >
        랜덤 추천 받기 (준비 중)
      </button>
    </div>
    {HOME_ENTRIES.length > 0 && (
      <div className="flex flex-1 flex-col gap-2.5">
        {HOME_ENTRIES.map((entry) => (
          <Link
            key={entry.no}
            href="#"
            aria-disabled
            className="shadow-flat flex min-h-[62px] flex-1 cursor-default items-center gap-3.5 border border-line bg-surface px-4"
          >
            <span className="w-[26px] text-[13px] font-black text-accent-text">{entry.no}</span>
            <span className="flex-1">
              <b className="block text-sm font-extrabold">
                {entry.label}
                {entry.disabled && (
                  <i className="bg-down-soft text-down ml-1.5 px-1.5 py-0.5 align-[2px] text-[9px] font-extrabold not-italic">
                    준비 중
                  </i>
                )}
              </b>
              <span className="mt-0.5 block text-[10.5px] text-muted">{entry.desc}</span>
            </span>
            <span aria-hidden className="text-[#C9C9C6]">
              ›
            </span>
          </Link>
        ))}
      </div>
    )}
  </aside>
);

export default HomeSide;
