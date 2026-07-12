import type { MetadataRoute } from 'next';

import { getNotices } from '@/api/getNotices';
import { SITE_URL } from '@/utils/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const noticeEntries: MetadataRoute.Sitemap = getNotices().map((notice) => ({
    url: `${SITE_URL}/notice/${notice.id}`,
    lastModified: new Date(notice.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/notice`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...noticeEntries,
    {
      url: `${SITE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/games`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
