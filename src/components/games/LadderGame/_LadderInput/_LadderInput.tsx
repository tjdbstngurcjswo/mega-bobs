'use client';

import { KeyboardEvent, useRef, useState } from 'react';

import {
  addButtonClass,
  colLabelClass,
  inputBoxClass,
  inputColsClass,
  inputRowClass,
  inputFieldClass,
  tagClass,
  tagRemoveClass,
  tagsWrapClass,
} from '../LadderGame.styles';

const MAX = 8;

interface TagColProps {
  variant: 'p' | 'i';
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  disabled?: boolean;
}

const TagCol = ({
  variant,
  label,
  values,
  onChange,
  placeholder,
  disabled,
}: TagColProps) => {
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isFull = values.length >= MAX;

  const add = (raw: string) => {
    const val = raw.trim();
    if (!val || values.includes(val) || isFull) return;
    onChange([...values, val]);
    setInputVal('');
  };

  const remove = (idx: number) => onChange(values.filter((_, i) => i !== idx));

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(inputVal);
    } else if (e.key === 'Backspace' && !inputVal && values.length > 0) {
      remove(values.length - 1);
    }
  };

  return (
    <div className={inputBoxClass}>
      <p className={colLabelClass(variant)}>
        {label} {values.length}/{MAX}
      </p>
      <div
        className={tagsWrapClass}
        onClick={() => inputRef.current?.focus()}
        role="presentation"
      >
        {values.map((v, i) => (
          <span key={v} className={tagClass(variant)}>
            {v}
            <button
              type="button"
              className={tagRemoveClass}
              onClick={(e) => { e.stopPropagation(); remove(i); }}
              aria-label={`${v} 제거`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className={inputRowClass}>
        <input
          ref={inputRef}
          className={inputFieldClass}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => add(inputVal)}
          placeholder={isFull ? `최대 ${MAX}개` : placeholder}
          disabled={disabled || isFull}
          aria-label={`${label} 입력`}
          maxLength={20}
        />
        <button
          type="button"
          className={addButtonClass(isFull || disabled)}
          onClick={() => { add(inputVal); inputRef.current?.focus(); }}
          disabled={isFull || disabled}
          aria-label={`${label} 추가`}
        >
          +
        </button>
      </div>
    </div>
  );
};

interface LadderInputProps {
  participants: string[];
  items: string[];
  onParticipantsChange: (v: string[]) => void;
  onItemsChange: (v: string[]) => void;
  disabled?: boolean;
}

const _LadderInput = ({
  participants,
  items,
  onParticipantsChange,
  onItemsChange,
  disabled,
}: LadderInputProps) => (
  <div className={inputColsClass}>
    <TagCol
      variant="p"
      label="참여자"
      values={participants}
      onChange={onParticipantsChange}
      placeholder="이름 입력"
      disabled={disabled}
    />
    <TagCol
      variant="i"
      label="항목"
      values={items}
      onChange={onItemsChange}
      placeholder="항목 입력"
      disabled={disabled}
    />
  </div>
);

export default _LadderInput;
