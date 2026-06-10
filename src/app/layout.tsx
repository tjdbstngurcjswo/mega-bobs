import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'react-hot-toast';

import './globals.css';

import { SITE_NAME } from '@/constants/site';
import { SITE_DESC } from '@/utils/jsonLd';

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
const siteDesc = SITE_DESC;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — 메가존 구내식당 점심 허브`,
    template: `%s — ${SITE_NAME}`,
  },
  description: siteDesc,
  keywords: [
    '메가존',
    '메가존 클라우드',
    '구내식당',
    '구내식당 메뉴',
    '점심',
    '점심 메뉴',
    '오늘의 점심',
    '식단',
    '식단표',
    '주간 식단',
    '메뉴',
    '과천',
    '과천 점심',
    '지식정보타운',
    '코스1',
    '코스2',
    '테이크아웃',
    '맛 평가',
    '식전 픽',
    '운영 시간',
    SITE_NAME,
  ],
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
    card: 'summary_large_image',
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
      <head>
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        )}
      </head>
      <body className={bodyClass}>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 2000,
            style: {
              background: '#111720',
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
