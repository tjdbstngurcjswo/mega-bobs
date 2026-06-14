import { Mail } from 'lucide-react';
import type { Metadata } from 'next';

import { PageLayout, SiteFooter, SiteHeader } from '@/components/@shared';
import { CONTACTS, SITE_NAME } from '@/constants/site';

export const metadata: Metadata = {
  title: '문의',
  description: `${SITE_NAME} 이용 문의 및 버그 제보는 이 페이지에서 제작자에게 직접 연락하세요.`,
  robots: { index: false },
  alternates: { canonical: '/contact' },
};

const ContactPage = () => (
  <>
    <SiteHeader />
    <PageLayout
      eyebrow="문의"
      title="궁금한 점이 있으신가요?"
      description="아래 이메일로 문의해 주세요."
    >
      <div className="grid grid-cols-2 gap-3">
        {CONTACTS.map(({ name, email }) => (
          <a
            key={email}
            href={`mailto:${email}`}
            className="bg-surface-warm flex flex-col gap-2 p-4"
          >
            <span className="text-ink text-[14px] font-extrabold">{name}</span>
            <span className="text-muted flex items-center gap-1.5 text-[12px]">
              <Mail size={12} />
              {email}
            </span>
          </a>
        ))}
      </div>
    </PageLayout>
    <SiteFooter />
  </>
);

export default ContactPage;
