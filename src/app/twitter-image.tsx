// TODO: 브랜드 디자인 완성 후 src/app/twitter-image.png 정적 파일로 교체 권장.
// 정적 PNG는 Edge 콜드스타트 없이 CDN 직접 서빙 (800×418).

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MegaBobs — 메가존 구내식당의 모든 것';
export const size = { width: 800, height: 418 };
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
          padding: '0 60px',
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
            width: 6,
            background: '#e2c04c',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-2px',
              lineHeight: '1',
            }}
          >
            MegaBobs
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#dde5f0',
              fontWeight: 500,
              letterSpacing: '-0.3px',
            }}
          >
            메가존 구내식당의 모든 것
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 18,
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
