const CalendarContainer = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex flex-1 flex-col gap-1 overflow-hidden px-4 py-4 sm:px-6 sm:py-4">
      {children}
    </div>
  );
};

export default CalendarContainer;
