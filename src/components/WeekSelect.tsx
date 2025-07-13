import dayjs from 'dayjs'
import 'dayjs/locale/ko'

interface WeekNavigatorProps {
  currentDate: Date
  onChange: (date: Date) => void
}

function getWeekStart(date: Date) {
  const d = dayjs(date)
  // 월요일 시작(0:일, 1:월, ..., 6:토)
  const day = d.day() === 0 ? 7 : d.day()
  return d.subtract(day - 1, 'day').startOf('day')
}

const WeekSelect = ({currentDate, onChange}: WeekNavigatorProps) => {
  const weekStart = getWeekStart(currentDate)
  const days = Array.from({length: 7}, (_, i) => weekStart.add(i, 'day'))

  const handlePrevWeek = () => {
    onChange(weekStart.subtract(7, 'day').toDate())
  }
  const handleNextWeek = () => {
    onChange(weekStart.add(7, 'day').toDate())
  }

  const weekRange = `${days[0].format('M월 D일')} ~ ${days[6].format('M월 D일')}`

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <button onClick={handlePrevWeek}>&lt;</button>
        <span className="font-semibold">{weekRange}</span>
        <button onClick={handleNextWeek}>&gt;</button>
      </div>
      <div className="flex gap-2">
        {days.map((d) => (
          <button
            key={d.format('YYYY-MM-DD')}
            className={`px-2 py-1 rounded ${d.isSame(dayjs(currentDate), 'day') ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => onChange(d.toDate())}
          >
            {d.locale('ko').format('dd')}
          </button>
        ))}
      </div>
    </div>
  )
} 

export default WeekSelect;