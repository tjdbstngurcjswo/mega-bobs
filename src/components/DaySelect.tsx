interface DaySelectProps {
  days: Array<{
    label: string
    date: number
    isSelected: boolean
  }>
  onSelectDay: (date: number) => void
}

const DaySelect = ({days, onSelectDay}: DaySelectProps) => {
  return (
    <div className="flex justify-center items-center gap-[4px] mt-lg">
      {days.map((day) => (
        <button
          key={day.date}
          onClick={() => onSelectDay(day.date)}
          className={`h-[30px] w-[68px] rounded-base flex flex-col items-center justify-center ${
            day.isSelected
              ? 'bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.1)]'
              : 'bg-white/10'
          }`}
        >
          <span
            className={`text-sm font-medium ${
              day.isSelected ? 'text-primary opacity-80' : 'text-white opacity-80'
            }`}
          >
            {day.label}
          </span>
          <span
            className={`text-base ${day.isSelected ? 'text-primary' : 'text-white'}`}
          >
            {day.date}
          </span>
        </button>
      ))}
    </div>
  )
} 

export default DaySelect