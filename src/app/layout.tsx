import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'react-hot-toast';

import './globals.css';

import { SITE_NAME } from '@/constants/site';

import { bodyClass } from './layout.styles';

/**
 * Pretendard 가변 폰트를 self-host — next/font가 size-adjust된 폴백을 자동 생성해
 * 폰트 스왑(FOUT) 시 발생하던 레이아웃 시프트를 제거한다.
 */
const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const siteDesc =
  '메가존 구내식당 메뉴, 실시간 운영 상태, 투표, 내기 게임까지 — 점심을 30초 안에 결정하세요.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — 메가존 구내식당 점심 허브`,
    template: `%s — ${SITE_NAME}`,
  },
  description: siteDesc,
  keywords: ['메가존', '구내식당', '점심', '식단', '메뉴', '과천', '지식정보타운', SITE_NAME],
  authors: [{ name: SITE_NAME }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — 메가존 구내식당 점심 허브`,
    description: siteDesc,
  },
  twitter: {
    card: 'summary',
    title: `${SITE_NAME} — 메가존 구내식당 점심 허브`,
    description: siteDesc,
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
    <html lang="ko" className={pretendard.variable}>
      <body className={bodyClass}>
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
        {process.env.VERCEL_ENV && <Analytics />}
      </body>
    </html>
  );
}
