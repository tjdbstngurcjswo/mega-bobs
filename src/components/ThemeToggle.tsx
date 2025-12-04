'use client';

import {Moon, Sun} from 'lucide-react';
import {useTheme} from 'next-themes';
import {useEffect, useState} from 'react';

import ThemeDropdown from './ThemeDropdown';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {resolvedTheme} = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render placeholder to avoid hydration mismatch
    return (
      <button
        aria-label="Toggle theme"
        className="ml-2 rounded-full p-2 transition-colors hover:bg-gray-700"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        aria-label="Toggle theme"
        className="ml-2 rounded-full p-2 transition-colors hover:bg-gray-700"
      >
        {resolvedTheme === 'light' && (
          <Sun size={20} className="text-yellow-600" />
        )}
        {resolvedTheme === 'dark' && (
          <Moon size={20} className="text-yellow-400" />
        )}
      </button>

      {isDropdownOpen && (
        <ThemeDropdown onClose={() => setIsDropdownOpen(false)} />
      )}
    </div>
  );
};

export default ThemeToggle;
