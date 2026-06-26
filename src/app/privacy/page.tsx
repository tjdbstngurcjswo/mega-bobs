import type { Metadata } from 'next';

import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import {
  legalSectionBodyClass,
  legalSectionClass,
  legalSectionListClass,
  legalSectionTableClass,
  legalSectionTdClass,
  legalSectionThClass,
  legalSectionTitleClass,
  tocLinkClass,
  tocListClass,
  tocTitleClass,
  tocWrapClass,
} from '@/app/legal.styles';
import { SITE_NAME } from '@/constants/site';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: `${SITE_NAME} 개인정보처리방침`,
  robots: { index: false },
  alternates: { canonical: '/privacy' },
};

const TOC_ITEMS = [
  { id: 'collected-info', label: '수집하는 정보' },
  { id: 'purpose', label: '정보 이용 목적' },
  { id: 'retention', label: '보관 기간 및 파기' },
  { id: 'third-party', label: '제3자 제공' },
  { id: 'user-rights', label: '이용자 권리' },
  { id: 'contact', label: '문의' },
];

const PrivacyPage = () => (
  <>
    <SiteHeader />
    <PageLayout
      eyebrow="법적 고지"
      title="개인정보처리방침"
      subtitle="최종 업데이트: 2026. 6. 8."
    >
      <nav aria-label="목차" className={tocWrapClass}>
        <p className={tocTitleClass}>목차</p>
        <ol className={tocListClass}>
          {TOC_ITEMS.map((item, i) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={tocLinkClass}>
                {i + 1}. {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="collected-info" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>1. 수집하는 정보</h2>
        <p className={legalSectionBodyClass}>
          {SITE_NAME}는 개인정보를 수집하지 않습니다. 맛 평가 투표 및 식전 픽
          기능의 중복 방지를 위해 브라우저의 localStorage에 익명 식별자(투표자
          ID)를 자동 생성하여 저장합니다. 이 식별자는 개인을 특정할 수 없는
          무작위 값(UUID)이며, 서버에 저장되지 않습니다.
        </p>
      </section>

      <section id="purpose" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>2. 정보 이용 목적</h2>
        <p className={legalSectionBodyClass}>
          수집된 익명 식별자는 다음 목적으로만 사용됩니다.
        </p>
        <ul className={legalSectionListClass}>
          <li>맛 평가 투표 및 식전 픽의 중복 제출 방지</li>
          <li>
            재미로 보는 비공식 수요 예측 집계 — 로그인 기반이 아니므로 정확하지
            않으며, 구내식당 운영에 실제로 활용되지 않습니다
          </li>
        </ul>
      </section>

      <section id="retention" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>3. 보관 기간 및 파기</h2>
        <p className={legalSectionBodyClass}>
          데이터베이스에 저장된 투표 및 픽 데이터는 생성일로부터
          <b> 2주 후 자동 삭제</b>됩니다. 브라우저 localStorage에 저장된 익명
          식별자는 이용자가 직접 브라우저 설정에서 삭제할 수 있으며, 삭제 후에도
          서비스 이용은 가능합니다.
        </p>
      </section>

      <section id="third-party" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>4. 제3자 제공</h2>
        <p className={legalSectionBodyClass}>
          수집된 정보는 제3자에게 판매하거나 마케팅 목적으로 공유하지 않습니다.
          서비스 운영을 위해 아래 외부 서비스를 이용합니다.
        </p>
        <table className={legalSectionTableClass}>
          <thead>
            <tr>
              <th className={legalSectionThClass}>서비스</th>
              <th className={legalSectionThClass}>용도</th>
              <th className={legalSectionThClass}>처리 내용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={legalSectionTdClass}>Supabase</td>
              <td className={legalSectionTdClass}>데이터베이스</td>
              <td className={legalSectionTdClass}>식단 데이터, 투표·픽 저장</td>
            </tr>
            <tr>
              <td className={legalSectionTdClass}>Vercel</td>
              <td className={legalSectionTdClass}>호스팅</td>
              <td className={legalSectionTdClass}>서비스 배포 및 엣지 처리</td>
            </tr>
            <tr>
              <td className={legalSectionTdClass}>Slack</td>
              <td className={legalSectionTdClass}>봇 연동</td>
              <td className={legalSectionTdClass}>
                {'/밥'} 슬래시 커맨드 처리
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="user-rights" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>5. 이용자 권리</h2>
        <p className={legalSectionBodyClass}>
          이용자는 브라우저 설정에서 사이트 데이터(localStorage)를 삭제하여 익명
          식별자를 제거할 수 있습니다. 삭제 후 재접속 시 새로운 식별자가
          자동으로 생성되며, 이전 투표·픽 이력은 복구되지 않습니다.
        </p>
      </section>

      <section id="contact" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>6. 문의</h2>
        <p className={legalSectionBodyClass}>
          개인정보 처리에 관한 문의는{' '}
          <a href="/contact" className="underline">
            문의
          </a>{' '}
          페이지를 통해 연락해 주세요.
        </p>
      </section>
    </PageLayout>
    <SiteFooter />
  </>
);

export default PrivacyPage;
