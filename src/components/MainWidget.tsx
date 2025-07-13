interface MainWidgetProps {
  children: React.ReactNode;
}

const MainWidget = ({children}: MainWidgetProps) => {
  return (
    <div className="flex h-[80vh] w-full max-w-[480px] flex-col overflow-y-auto shadow-2xl min-[480px]:rounded-2xl">
      {children}
    </div>
  );
};

export default MainWidget;
