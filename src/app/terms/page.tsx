import type { Metadata } from 'next';

import { LegalPageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import {
  legalSectionBodyClass,
  legalSectionClass,
  legalSectionListClass,
  legalSectionTitleClass,
} from '@/components/@shared/layout/LegalPageLayout/LegalPageLayout.styles';
import { SITE_NAME } from '@/constants/site';

export const metadata: Metadata = {
  title: '이용약관',
  description: `${SITE_NAME} 서비스 이용약관`,
  robots: { index: false },
  alternates: { canonical: '/terms' },
};

const TOC_ITEMS = [
  { id: 'service-overview', label: '서비스 개요' },
  { id: 'usage-terms', label: '이용 조건' },
  { id: 'how-to-use', label: '서비스 이용 방법' },
  { id: 'prohibited', label: '금지 행위' },
  { id: 'changes', label: '서비스 변경·중단' },
  { id: 'disclaimer', label: '면책 조항' },
  { id: 'contact', label: '문의' },
];

const TermsPage = () => (
  <>
    <SiteHeader />
    <LegalPageLayout
      title="이용약관"
      updatedAt="2026. 6. 8."
      tocItems={TOC_ITEMS}
    >
      <section id="service-overview" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>1. 서비스 개요</h2>
        <p className={legalSectionBodyClass}>
          {SITE_NAME}는 메가존 직원이 구내식당 메뉴 확인의 불편함을 해소하기
          위해 자발적으로 만든 비공식 사이드 프로젝트입니다. 메가존이 운영하거나 공식
          승인한 서비스가 아닙니다. 날짜별 식단 확인, 코스별 맛 평가 투표,
          식전 픽 선택 등의 기능을 무상으로 제공합니다.
        </p>
      </section>

      <section id="usage-terms" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>2. 이용 조건</h2>
        <p className={legalSectionBodyClass}>
          별도 회원가입이나 로그인 없이 누구나 이용할 수 있습니다. 서비스에
          접속하면 본 약관에 동의한 것으로 간주합니다.
        </p>
      </section>

      <section id="how-to-use" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>3. 서비스 이용 방법</h2>
        <p className={legalSectionBodyClass}>
          본 서비스는 다음 기능을 제공합니다.
        </p>
        <ul className={legalSectionListClass}>
          <li>
            <b>식단표 조회</b> — 주간 캘린더에서 날짜를 선택해 코스1·코스2·테이크아웃
            메뉴와 칼로리 정보를 확인할 수 있습니다.
          </li>
          <li>
            <b>맛 평가 투표</b> — 각 코스에 대해 평가할 수 있습니다. 하루
            코스당 1회만 투표 가능합니다.
          </li>
          <li>
            <b>식전 픽</b> — 오늘 먹을 코스(코스1·코스2·테이크아웃)를 미리
            선택해 집계를 확인할 수 있습니다.
          </li>
          <li>
            <b>Slack 봇</b> — {'/밥'} 슬래시 커맨드로 오늘·내일·모레·글피의
            식단을 조회할 수 있습니다.
          </li>
        </ul>
      </section>

      <section id="prohibited" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>4. 금지 행위</h2>
        <p className={legalSectionBodyClass}>
          이용자는 다음 행위를 해서는 안 됩니다.
        </p>
        <ul className={legalSectionListClass}>
          <li>자동화 프로그램·스크립트를 이용한 대량 요청 또는 데이터 수집</li>
          <li>타인의 투표·픽 결과를 조작하는 행위</li>
          <li>서비스 인프라에 과도한 부하를 발생시키는 행위</li>
          <li>서비스 운영을 방해하는 일체의 행위</li>
        </ul>
      </section>

      <section id="changes" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>5. 서비스 변경·중단</h2>
        <p className={legalSectionBodyClass}>
          본 서비스는 개인이 자유 시간에 유지·관리하는 비공식 프로젝트로,
          예고 없이 변경되거나 중단될 수 있습니다. 중요한 변경사항은
          공지사항 페이지를 통해 안내하도록 노력합니다.
        </p>
      </section>

      <section id="disclaimer" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>6. 면책 조항</h2>
        <p className={legalSectionBodyClass}>
          표시되는 식단 정보는 공식적으로 제공받은 데이터가 아니며 실제
          메뉴와 다를 수 있습니다. 정보의 정확성·완전성을 보장하지 않으며,
          이로 인한 불이익에 대해 제작자는 책임을 지지 않습니다. 시스템
          장애·점검 등으로 인한 서비스 중단에도 동일하게 적용됩니다.
        </p>
      </section>

      <section id="contact" className={legalSectionClass}>
        <h2 className={legalSectionTitleClass}>7. 문의</h2>
        <p className={legalSectionBodyClass}>
          서비스 관련 문의는{' '}
          <a href="/contact" className="underline">
            문의
          </a>{' '}
          페이지를 통해 연락해 주세요.
        </p>
      </section>
    </LegalPageLayout>
    <SiteFooter />
  </>
);

export default TermsPage;
