// TODO: 브랜드 디자인 완성 후 src/app/opengraph-image.png 정적 파일로 교체 권장.
// 정적 PNG는 빌드 캐시 없이 CDN에서 직접 서빙되어 Edge 콜드스타트가 없음 (1200×630).

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MegaBobs ∙ 메가존 구내식당의 모든 것';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#111720',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 80px',
          position: 'relative',
        }}
      >
        {/* 브랜드 액센트 바 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: '#e2c04c',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-3px',
              lineHeight: '1',
            }}
          >
            MegaBobs
          </div>
          <div
            style={{
              fontSize: 38,
              color: '#dde5f0',
              fontWeight: 500,
              letterSpacing: '-0.5px',
            }}
          >
            메가존 구내식당의 모든 것
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 56,
            right: 80,
            fontSize: 22,
            color: '#455060',
            letterSpacing: '0.5px',
          }}
        >
          megabobs.com
        </div>
      </div>
    ),
    { ...size }
  );
}
