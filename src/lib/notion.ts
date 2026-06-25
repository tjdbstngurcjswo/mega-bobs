import 'server-only';

import { Client } from '@notionhq/client';

export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const NOTICES_DB_ID = process.env.NOTION_NOTICES_DB_ID!;
