import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {Toaster} from 'react-hot-toast';

import {AppLayout} from '@/components/layout';
import {ThemeProvider} from '@/components/ThemeProvider';

import {Analytics} from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: '메가존 구내식당',
  description: '메가존 구내식당 식단표',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  other: {
    'google-adsense-account': 'ca-pub-4501038602130909',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-[#181A20]`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppLayout>{children}</AppLayout>
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 2000,
              style: {
                background: '#1f2937',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
              },
            }}
          />
        </ThemeProvider>
        <Analytics mode="production" />
      </body>
    </html>
  );
}
