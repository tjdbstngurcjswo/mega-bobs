import { COMPANY_LABEL } from '@/models/news';

import type { NewsFilterId } from './NewsFilter.types';

export const FILTER_OPTIONS: { id: NewsFilterId; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'megazone', label: COMPANY_LABEL.megazone },
  { id: 'megazonecloud', label: COMPANY_LABEL.megazonecloud },
  { id: 'megazonesoft', label: COMPANY_LABEL.megazonesoft },
];
