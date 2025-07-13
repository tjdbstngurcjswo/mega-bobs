interface MainWidgetProps {
  children: React.ReactNode;
}

const MainWidget = ({children}: MainWidgetProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-h-[80vh] w-full max-w-[480px] overflow-hidden shadow-2xl min-[480px]:rounded-2xl">
        <div className="bg-slate-800 px-6 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-xl text-white">MegaBobs</h1>
          </div>
        </div>
        <div className="bg-white">{children}</div>
      </div>
    </div>
  );
};

export default MainWidget;
