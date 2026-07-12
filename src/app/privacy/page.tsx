import type { Metadata } from 'next';

import {
  legalSectionBodyClass,
  legalSectionClass,
  legalSectionListClass,
  legalSectionTableClass,
  legalSectionTdClass,
  legalSectionThClass,
  legalSectionTitleClass,
} from '@/app/legal.styles';
import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import LegalTocNav from '@/components/legal/LegalTocNav/LegalTocNav';
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
  { id: 'cookies-ads', label: '쿠키 및 광고' },
  { id: 'user-rights', label: '이용자 권리' },
  { id: 'contact', label: '문의' },
];

const PrivacyPage = () => (
  <>
    <SiteHeader />
    <PageLayout
      eyebrow="법적 고지"
      title="개인정보처리방침"
      subtitle="최종 업데이트: 2026. 7. 12."
    >
      <LegalTocNav items={TOC_ITEMS} />

      <section id="collected-info" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>1. 수집하는 정보</h2>
        <p className={legalSectionBodyClass}>
          {SITE_NAME}는 개인정보를 수집하지 않습니다. 맛 평가 투표 및 식전 픽
          기능의 중복 방지를 위해 브라우저의 localStorage에 익명 식별자(투표자
          ID)를 자동 생성하여 저장합니다. 이 식별자는 개인을 특정할 수 없는
          무작위 값(UUID)이며, 서버에 저장되지 않습니다. 이 외에도 Google
          Analytics 및 Google 광고 서비스가 쿠키를 통해 방문 통계, 기기 정보 등
          비식별 이용 데이터를 자동으로 수집합니다. 자세한 내용은{' '}
          <a href="#cookies-ads" className="underline">
            쿠키 및 광고
          </a>{' '}
          항목을 참고해 주세요.
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
            <tr>
              <td className={legalSectionTdClass}>Google Analytics</td>
              <td className={legalSectionTdClass}>이용 통계</td>
              <td className={legalSectionTdClass}>
                방문 페이지, 체류 시간 등 비식별 통계
              </td>
            </tr>
            <tr>
              <td className={legalSectionTdClass}>Google AdSense</td>
              <td className={legalSectionTdClass}>광고 게재</td>
              <td className={legalSectionTdClass}>
                쿠키 기반 맞춤 광고 및 광고 성과 측정
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="cookies-ads" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>5. 쿠키 및 광고</h2>
        <p className={legalSectionBodyClass}>
          {SITE_NAME}는 Google AdSense를 통해 광고를 게재하며, Google과
          협력업체는 쿠키를 사용해 이용자의 사이트 방문 이력을 기반으로 맞춤
          광고를 제공할 수 있습니다. Google이 광고 쿠키를 사용하는 방식은{' '}
          <a
            href="https://policies.google.com/technologies/ads"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 광고 정책
          </a>{' '}
          페이지에서 확인할 수 있습니다.
        </p>
        <p className={legalSectionBodyClass}>
          이용자는{' '}
          <a
            href="https://adssettings.google.com"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 광고 설정
          </a>{' '}
          또는{' '}
          <a
            href="https://www.aboutads.info/choices"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info
          </a>{' '}
          에서 맞춤 광고를 거부할 수 있으며, 브라우저 설정에서 쿠키 저장을 직접
          차단할 수도 있습니다.
        </p>
      </section>

      <section id="user-rights" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>6. 이용자 권리</h2>
        <p className={legalSectionBodyClass}>
          이용자는 브라우저 설정에서 사이트 데이터(localStorage)를 삭제하여 익명
          식별자를 제거할 수 있습니다. 삭제 후 재접속 시 새로운 식별자가
          자동으로 생성되며, 이전 투표·픽 이력은 복구되지 않습니다.
        </p>
      </section>

      <section id="contact" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>7. 문의</h2>
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
