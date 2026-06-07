import {EntryInnerProps} from '@/types/site';

const EntryInner = ({no, label, desc, disabled}: EntryInnerProps) => (
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
    <span aria-hidden className="text-line">
      ›
    </span>
  </>
);

export default EntryInner;
