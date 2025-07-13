'use client';

import {Info, Mail} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';

const Header = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleEmailClick = (email: string) => {
    const subject = encodeURIComponent('[MegaBobs] 문의');
    const body = encodeURIComponent(`안녕하세요,

MegaBobs 앱 관련 문의드립니다.

내용: 

감사합니다.`);

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setIsContactOpen(false);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsContactOpen(false);
      }
    };

    if (isContactOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isContactOpen]);

  return (
    <header className="relative flex-shrink-0 bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        <h1 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
          MegaBobs
        </h1>
        <div className="flex flex-1 justify-end">
          <button
            onClick={() => setIsContactOpen(!isContactOpen)}
            className="rounded-lg p-2 text-white transition-all hover:bg-white/10"
          >
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* 개발자 연락처 드롭다운 */}
      {isContactOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-3 z-50 mt-2 w-72 rounded-lg bg-white p-4 shadow-lg sm:right-6"
        >
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-800">
              개발팀 연락처
            </h3>
            <p className="text-xs text-gray-600">
              문의사항이나 개선사항이 있으시면 연락주세요!
            </p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleEmailClick('yoonp@mz.co.kr')}
              className="flex w-full items-center gap-3 rounded-md bg-blue-50 p-3 text-left transition-colors hover:bg-blue-100"
            >
              <Mail size={16} className="text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-800">박서윤</div>
                <div className="text-xs text-gray-600">yoonp@mz.co.kr</div>
              </div>
            </button>
            <button
              onClick={() => handleEmailClick('tngur1120@mz.co.kr')}
              className="flex w-full items-center gap-3 rounded-md bg-blue-50 p-3 text-left transition-colors hover:bg-blue-100"
            >
              <Mail size={16} className="text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-800">홍수혁</div>
                <div className="text-xs text-gray-600">tngur1120@mz.co.kr</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
