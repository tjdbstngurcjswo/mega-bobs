import {ReactNode} from 'react';

import {cn} from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'blue';
}

export function Badge({children, className, variant = 'default'}: BadgeProps) {
  return (
    <span
      className={cn(
        'px-sm py-xs inline-flex items-center justify-center rounded-full text-xs font-normal',
        {
          'bg-primary-main text-white': variant === 'default',
          'border-primary-main text-primary-main border': variant === 'outline',
          'bg-accent-blue-light text-primary-main': variant === 'blue',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
