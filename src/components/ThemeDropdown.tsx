'use client';

import {Monitor, Moon, Sun} from 'lucide-react';
import {useTheme} from 'next-themes';
import {useEffect, useRef} from 'react';

interface ThemeDropdownProps {
  onClose: () => void;
}

const ThemeDropdown = ({onClose}: ThemeDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {theme, setTheme} = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
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
      className="absolute top-full right-3 z-50 mt-2 w-48 rounded-lg bg-white p-2 shadow-2xl sm:right-6 dark:bg-[#2C2D35] dark:shadow-lg"
    >
      <div className="mb-2 px-2 pt-1">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
          테마 설정
        </h3>
      </div>
      <div className="space-y-1">
        <button
          onClick={() => handleThemeChange('light')}
          className={`flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors ${
            theme === 'light'
              ? 'bg-slate-200 dark:bg-[#181A20]'
              : 'hover:bg-slate-100 dark:hover:bg-[#23242B]'
          }`}
        >
          <Sun size={18} className="text-slate-600 dark:text-slate-300" />
          <span className="text-sm font-medium text-slate-800 dark:text-white">
            라이트 모드
          </span>
        </button>
        <button
          onClick={() => handleThemeChange('dark')}
          className={`flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors ${
            theme === 'dark'
              ? 'bg-slate-200 dark:bg-[#181A20]'
              : 'hover:bg-slate-100 dark:hover:bg-[#23242B]'
          }`}
        >
          <Moon size={18} className="text-slate-600 dark:text-slate-300" />
          <span className="text-sm font-medium text-slate-800 dark:text-white">
            다크 모드
          </span>
        </button>
        <button
          onClick={() => handleThemeChange('system')}
          className={`flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors ${
            theme === 'system'
              ? 'bg-slate-200 dark:bg-[#181A20]'
              : 'hover:bg-slate-100 dark:hover:bg-[#23242B]'
          }`}
        >
          <Monitor size={18} className="text-slate-600 dark:text-slate-300" />
          <span className="text-sm font-medium text-slate-800 dark:text-white">
            시스템 설정
          </span>
        </button>
      </div>
    </div>
  );
};

export default ThemeDropdown;
