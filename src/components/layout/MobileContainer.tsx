interface MobileContainerProps {
  children: React.ReactNode;
}

const MobileContainer = ({children}: MobileContainerProps) => {
  return (
    <div className="flex h-screen w-full min-w-[320px] flex-col overflow-hidden bg-white shadow-2xl sm:max-h-[90vh] sm:min-h-[600px] sm:max-w-lg sm:min-w-[400px] sm:rounded-3xl md:max-w-xl md:min-w-[500px] lg:max-w-2xl lg:min-w-[600px]">
      {children}
    </div>
  );
};

export default MobileContainer;
