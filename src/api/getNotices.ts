import 'server-only';

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { unstable_cache } from 'next/cache';

import { NOTICES_DB_ID, notionClient } from '@/lib/notion';
import { blocksToMarkdown } from '@/lib/notionToMarkdown';
import type { Notice } from '@/models/notice';

const mapPageToNotice = (page: PageObjectResponse): Notice | null => {
  const nameProp = page.properties['Name'];
  const dateProp = page.properties['PublishedAt'];

  const title =
    nameProp?.type === 'title' ? (nameProp.title[0]?.plain_text ?? '') : '';
  const publishedAt =
    dateProp?.type === 'date' ? (dateProp.date?.start ?? '') : '';

  if (!title || !publishedAt) return null;

  return { id: page.id, title, body: '', publishedAt };
};

const fetchNotices = async (): Promise<Notice[]> => {
  const response = await notionClient.dataSources.query({
    data_source_id: NOTICES_DB_ID,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'PublishedAt', direction: 'descending' }],
  });

  return (response.results as PageObjectResponse[])
    .filter((p) => 'properties' in p)
    .map(mapPageToNotice)
    .filter((n): n is Notice => n !== null);
};

export const getNotices = unstable_cache(fetchNotices, ['notices-list'], {
  tags: ['notices'],
});

const fetchNoticeById = async (id: string): Promise<Notice | undefined> => {
  try {
    const page = await notionClient.pages.retrieve({ page_id: id });
    if (!('properties' in page)) return undefined;

    const mapped = mapPageToNotice(page as PageObjectResponse);
    if (!mapped) return undefined;

    const body = await blocksToMarkdown(id);
    return { ...mapped, body };
  } catch {
    return undefined;
  }
};

export const getNoticeById = unstable_cache(
  fetchNoticeById,
  ['notice-detail'],
  { tags: ['notices'] }
);
