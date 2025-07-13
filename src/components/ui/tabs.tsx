import {ReactNode} from 'react';

import {cn} from '@/lib/utils';

interface TabsProps {
  children: ReactNode;
  className?: string;
}

export function Tabs({children, className}: TabsProps) {
  return (
    <div
      className={cn(
        'p-xs gap-sm flex items-center justify-center rounded-md bg-[rgba(243,244,246,0.5)]',
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabProps {
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function Tab({children, className, isActive, onClick}: TabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-base text-text-primary px-[44px] py-[3px] text-base font-medium transition-colors',
        isActive && 'text-text-primary bg-white shadow-sm',
        !isActive && 'hover:bg-white/10',
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabPanelProps {
  children: ReactNode;
  className?: string;
  isActive?: boolean;
}

export function TabPanel({children, className, isActive}: TabPanelProps) {
  if (!isActive) return null;

  return (
    <div
      className={cn(
        'p-md rounded-md bg-white/30 shadow-md backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  );
}
