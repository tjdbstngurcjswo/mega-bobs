import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: '메가존 구내식당',
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
        <main className="min-h-screen bg-gradient-to-br from-[#EFF6FF] via-[#EFF6FF] to-[#FAF5FF]">
          {children}
        </main>
      </body>
    </html>
  );
}
