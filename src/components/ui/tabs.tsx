import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface TabsProps {
  children: ReactNode
  className?: string
}

export function Tabs({ children, className }: TabsProps) {
  return (
    <div
      className={cn(
        'bg-[rgba(243,244,246,0.5)] p-xs rounded-md flex items-center justify-center gap-sm',
        className
      )}
    >
      {children}
    </div>
  )
}

interface TabProps {
  children: ReactNode
  className?: string
  isActive?: boolean
  onClick?: () => void
}

export function Tab({ children, className, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-[44px] py-[3px] rounded-base text-text-primary text-base font-medium transition-colors',
        isActive && 'bg-white shadow-sm text-text-primary',
        !isActive && 'hover:bg-white/10',
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabPanelProps {
  children: ReactNode
  className?: string
  isActive?: boolean
}

export function TabPanel({ children, className, isActive }: TabPanelProps) {
  if (!isActive) return null

  return (
    <div
      className={cn(
        'bg-white/30 backdrop-blur-sm rounded-md shadow-md p-md',
        className
      )}
    >
      {children}
    </div>
  )
} 