interface WeekSelectProps {
  currentWeek: string
  onPrevWeek: () => void
  onNextWeek: () => void
}

export function WeekSelect({ currentWeek, onPrevWeek, onNextWeek }: WeekSelectProps) {
  return (
    <div className="flex justify-between items-center mt-lg">
      <button
        onClick={onPrevWeek}
        className="h-7 w-7 flex items-center justify-center rounded-base bg-white/10"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.17">
          <path d="M8.75 3.5L5.25 7L8.75 10.5" />
        </svg>
      </button>
      <div className="bg-white/20 backdrop-blur-xs rounded-base py-[6px] px-[14px] flex items-center">
        <div className="pr-[7px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.33">
            <path d="M5.33 1.33V4" />
            <path d="M10.67 1.33V4" />
            <path d="M2 2.67H14V14.67H2V2.67Z" />
            <path d="M2 6.67H14" />
          </svg>
        </div>
        <span className="text-base text-white">{currentWeek}</span>
      </div>
      <button
        onClick={onNextWeek}
        className="h-7 w-7 flex items-center justify-center rounded-base bg-white/10"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.17">
          <path d="M5.25 3.5L8.75 7L5.25 10.5" />
        </svg>
      </button>
    </div>
  )
} 