'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useHasMounted } from '@/hooks/useHasMounted';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  if (!mounted) return <div className="size-9" />;

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="text-ink-2 flex size-9 items-center justify-center"
    >
      {isDark ? (
        <Sun size={17} strokeWidth={2.2} />
      ) : (
        <Moon size={17} strokeWidth={2.2} />
      )}
    </button>
  );
};

export default ThemeToggle;
