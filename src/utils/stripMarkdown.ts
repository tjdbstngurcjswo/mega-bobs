export const stripMarkdown = (md: string): string =>
  md
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*{1,2}|_{1,2})(.*?)\1/g, '$2')
    .replace(/^[-*>]\s+/gm, '')
    .replace(/^-{3,}$/gm, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\n/g, ' ')
    .trim();
