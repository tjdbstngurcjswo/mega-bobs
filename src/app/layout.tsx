import type {Metadata} from 'next';
import {Inter} from 'next/font/google';

import {AppLayout} from '@/components/layout';
import QueryProvider from '@/components/QueryProvider';
import './globals.css';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: '메가밥스',
  description: '메가존 구내식당 식단표',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <QueryProvider>
          <AppLayout>{children}</AppLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
