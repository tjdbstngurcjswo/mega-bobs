'use client';

import {createContext, useContext, useMemo} from 'react';

interface DateContextType {
  today: Date;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider = ({
  children,
  today,
}: {
  children: React.ReactNode;
  today: Date;
}) => {
  const value = useMemo(() => ({today}), [today]);
  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
};

export const useToday = () => {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error('useToday must be used within a DateProvider');
  }
  return context.today;
};
