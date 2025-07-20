'use client';

import {Info} from 'lucide-react';
import {useState} from 'react';

import ContactDropdown from './ContactDropdown';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <header className="relative flex-shrink-0 bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-3 sm:px-6 sm:py-4 dark:from-[#23242B] dark:to-[#181A20]">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsContactOpen((prev) => !prev)}
          className="mr-2 rounded-full p-2 text-white transition-all hover:bg-gray-700"
        >
          <Info size={20} />
        </button>
        <h1 className="text-center text-lg font-bold text-white sm:text-xl md:text-2xl dark:text-white">
          MegaBobs
        </h1>
        <ThemeToggle />
      </div>

      {/* 개발자 연락처 드롭다운 */}
      {isContactOpen && (
        <ContactDropdown onClose={() => setIsContactOpen(false)} />
      )}
    </header>
  );
};

export default Header;
