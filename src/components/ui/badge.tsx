import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'blue'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-sm py-xs rounded-full text-xs font-normal',
        {
          'bg-primary-main text-white': variant === 'default',
          'border border-primary-main text-primary-main': variant === 'outline',
          'bg-accent-blue-light text-primary-main': variant === 'blue',
        },
        className
      )}
    >
      {children}
    </span>
  )
} 