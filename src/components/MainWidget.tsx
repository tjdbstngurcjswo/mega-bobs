interface MainWidgetProps {
  children: React.ReactNode
}

const MainWidget = ({children}: MainWidgetProps) => {
  return (
    <div className="min-h-screen bg-accent-blue-lighter p-lg flex items-center justify-center">
      <div className="w-full max-w-container bg-white rounded-lg shadow-card overflow-hidden">
        <div className="bg-gradient-primary px-lg pt-lg pb-md">
          <div className="flex justify-center items-center gap-sm">
            <div className="bg-white/20 backdrop-blur-xs rounded-base p-[10px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12.84 2H22V11.16" />
                <path d="M22 2L2.06 22" />
                <path d="M8.5 15.8L2.1 22.2" />
                <path d="M19 5L12 12" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-white">MegaBobs</h1>
            <div className="bg-white/20 backdrop-blur-xs rounded-base p-[10px]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.67">
                <path d="M1.67 1.67H18.34" />
                <path d="M16.67 2.5V5.83" />
                <path d="M15 4.17H18.33" />
                <path d="M3.33 14.17V15.84" />
                <path d="M2.5 15H4.17" />
              </svg>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default MainWidget;