import {Analytics} from '@vercel/analytics/next';
import type {Metadata} from 'next';
import {Toaster} from 'react-hot-toast';

import './globals.css';

export const metadata: Metadata = {
  title: '메가밥스 — 메가존 구내식당 점심 허브',
  description: '구내식당 메뉴, 투표, 내기 게임, 지정타 맛집까지',
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
    <html lang="ko">
      <body className="bg-bg text-ink">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 2000,
            style: {
              background: '#111111',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '0',
            },
          }}
        />
        <Analytics mode="production" />
      </body>
    </html>
  );
}
