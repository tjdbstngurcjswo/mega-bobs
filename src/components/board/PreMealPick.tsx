'use client';

import dayjs from '@/lib/dayjs';
import {useHasMounted} from '@/lib/useHasMounted';
import {usePick} from '@/lib/hooks/usePick';
import {isCafeteriaOpen} from '@/lib/menu-policy';
import {cn} from '@/lib/utils';
import {PickType} from '@/types/vote';

interface PreMealPickProps {
  date: string;
}

const PICKS: {type: PickType; label: string}[] = [
  {type: 'A', label: 'A코스'},
  {type: 'B', label: 'B코스'},
  {type: 'takeout', label: '테이크아웃'},
  {type: 'pass', label: '패스'},
];

const PreMealPick = ({date}: PreMealPickProps) => {
  const mounted = useHasMounted();
  const {myPick, counts, isLoading, submitPick} = usePick(date);

  if (!mounted) return null;
  if (!isCafeteriaOpen(dayjs().tz())) return null;

  return (
    <div className="border-b border-line px-6 py-4">
      <p className="mb-3 text-[11px] font-bold tracking-wide text-muted">
        오늘 뭐 먹을 거예요?
      </p>
      <div className="flex gap-2">
        {PICKS.map(({type, label}) => {
          const selected = myPick === type;
          const count = counts[type];
          return (
            <button
              key={type}
              type="button"
              disabled={isLoading}
              aria-pressed={selected}
              aria-label={`${label} 선택${count > 0 ? `, ${count}명` : ''}`}
              onClick={() => submitPick(type)}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center gap-1 border px-2 py-2.5 text-[11px] font-bold transition-colors',
                selected
                  ? 'border-accent bg-accent text-[#3d2900]'
                  : 'border-line bg-surface text-ink-2 hover:border-accent/60 hover:bg-accent-soft'
              )}
            >
              <span>{label}</span>
              <span
                className={cn(
                  'text-[10px] font-medium tabular-nums',
                  selected ? 'text-[#3d2900]/70' : 'text-muted'
                )}
              >
                {count}명
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PreMealPick;
