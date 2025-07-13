import {ReactNode} from 'react';

import {cn} from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({children, className}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-white/20 bg-white/50 shadow-lg backdrop-blur-md',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({children, className}: CardHeaderProps) {
  return (
    <div className={cn('p-md flex items-center justify-between', className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({children, className}: CardContentProps) {
  return <div className={cn('p-md', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({children, className}: CardFooterProps) {
  return (
    <div className={cn('p-md flex items-center justify-between', className)}>
      {children}
    </div>
  );
}
