import 'server-only';

import { NotionToMarkdown } from 'notion-to-md';

import { notionClient } from './notion';

const n2m = new NotionToMarkdown({ notionClient });

export const blocksToMarkdown = async (pageId: string): Promise<string> => {
  const blocks = await n2m.pageToMarkdown(pageId);
  return n2m.toMarkdownString(blocks).parent;
};
