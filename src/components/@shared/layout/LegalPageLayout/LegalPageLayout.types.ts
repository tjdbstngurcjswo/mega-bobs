import { ReactNode } from 'react';

interface TocItem {
  id: string;
  label: string;
}

export interface LegalPageLayoutProps {
  title: string;
  updatedAt: string;
  tocItems: TocItem[];
  children: ReactNode;
}
