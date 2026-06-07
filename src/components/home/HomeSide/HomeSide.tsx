import Link from 'next/link';

import { HOME_ENTRIES } from '@/constants/site';

import EntryInner from './EntryInner';
import {
  entryClass,
  randomButtonClass,
  randomCardClass,
  randomCardDescClass,
  randomCardTitleClass,
} from './HomeSide.styles';

const HomeSide = () => (
  <aside className="flex flex-col gap-4">
    <div className={randomCardClass}>
      <h3 className={randomCardTitleClass}>오늘 뭐 먹지?</h3>
      <p className={randomCardDescClass}>
        구내식당과 지정타 맛집 중에서
        <br />
        점심 메뉴를 골라드려요
      </p>
      <button disabled className={randomButtonClass}>
        랜덤 추천 받기 (준비 중)
      </button>
    </div>
    {HOME_ENTRIES.length > 0 && (
      <div className="flex flex-1 flex-col gap-2.5">
        {HOME_ENTRIES.map((entry) =>
          entry.disabled ? (
            <div
              key={entry.no}
              aria-disabled="true"
              className={`${entryClass} cursor-default`}
            >
              <EntryInner {...entry} />
            </div>
          ) : (
            <Link key={entry.no} href={entry.href} className={entryClass}>
              <EntryInner {...entry} />
            </Link>
          )
        )}
      </div>
    )}
  </aside>
);

export default HomeSide;
