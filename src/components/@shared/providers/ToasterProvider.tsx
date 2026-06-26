'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'react-hot-toast';

import { useHasMounted } from '@/hooks/useHasMounted';

const ToasterProvider = () => {
  const { resolvedTheme } = useTheme();
  const mounted = useHasMounted();

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 2000,
        style: {
          background: isDark ? 'var(--color-ink)' : 'var(--color-board)',
          color: isDark ? 'var(--color-board)' : 'var(--color-surface)',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '0',
        },
      }}
    />
  );
};

export default ToasterProvider;
