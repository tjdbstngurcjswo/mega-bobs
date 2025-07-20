'use client';

import {useEffect, useRef} from 'react';

import ContactButton from './ContactButton';

interface ContactDropdownProps {
  onClose: () => void;
}

const ContactDropdown = ({onClose}: ContactDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleEmailClick = (email: string) => {
    const subject = encodeURIComponent('[MegaBobs] 문의');
    const body = encodeURIComponent(`안녕하세요,

MegaBobs 앱 관련 문의드립니다.

내용:

감사합니다.`);

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-3 z-50 w-72 rounded-lg bg-white p-4 shadow-2xl sm:left-6 dark:bg-[#2C2D35] dark:shadow-lg"
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
          개발팀 연락처
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          문의사항이나 개선사항이 있으시면 연락주세요!
        </p>
      </div>
      <div className="space-y-2">
        <ContactButton
          onClick={() => handleEmailClick('yoonp@mz.co.kr')}
          title="박서윤"
          email="yoonp@mz.co.kr"
        />
        <ContactButton
          onClick={() => handleEmailClick('tngur1120@mz.co.kr')}
          title="홍수혁"
          email="tngur1120@mz.co.kr"
        />
      </div>
    </div>
  );
};

export default ContactDropdown;
