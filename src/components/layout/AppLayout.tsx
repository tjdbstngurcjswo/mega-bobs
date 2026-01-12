interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({children}: AppLayoutProps) => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-purple-50 dark:from-[#181A20] dark:via-[#23242B] dark:to-[#181A20]">
      <div className="flex min-h-screen items-center justify-center sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
        {children}
      </div>
    </main>
  );
};

export default AppLayout;
