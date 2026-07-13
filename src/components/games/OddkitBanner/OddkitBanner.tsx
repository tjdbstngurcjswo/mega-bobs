'use client';

import { trackEvent } from '@/utils/ga';

import {
  bannerWrapClass,
  contentClass,
  ctaLinkClass,
  cursorClass,
  descClass,
  taglineClass,
  wordmarkClass,
  wordmarkSwatchClass,
} from './OddkitBanner.styles';

const handleCtaClick = () => {
  trackEvent('event', 'oddkit_banner_click', {});
};

const OddkitBanner = () => (
  <aside className={bannerWrapClass} aria-label="oddkit 홍보">
    <div className={contentClass}>
      <span className={wordmarkClass}>
        <span className={wordmarkSwatchClass} aria-hidden="true" />
        oddkit
        <span className={cursorClass} aria-hidden="true">
          ▮
        </span>
      </span>
      <p className={taglineClass}>자주 안 써도 있으면 든든한 업무 도구예요</p>
      <p className={descClass}>
        이미지 변환·압축·리사이즈를 업로드 없이 브라우저에서 바로 처리해요
      </p>
    </div>
    <a
      href="https://oddkit.tools"
      target="_blank"
      rel="noopener noreferrer"
      className={ctaLinkClass}
      aria-label="oddkit.tools 새 창에서 열기"
      onClick={handleCtaClick}
    >
      둘러보기
    </a>
  </aside>
);

export default OddkitBanner;
