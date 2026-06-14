import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MegaBobs ∙ 메가존 구내식당',
    short_name: 'MegaBobs',
    description:
      '메가존 구내식당 메뉴, 실시간 운영 상태, 투표까지 — 점심을 30초 안에 결정하세요.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f3f6fb',
    theme_color: '#111720',
    icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }],
  };
}
