'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <NextThemesProvider
    attribute="data-theme"
    defaultTheme="system"
    enableSystem
    storageKey="megabobs-theme"
  >
    {children}
  </NextThemesProvider>
);

export default ThemeProvider;
