export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'error';

export const shareMenuUrl = async (dateStr: string): Promise<ShareResult> => {
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set('date', dateStr);
  const url = shareUrl.toString();

  if (navigator.share) {
    try {
      await navigator.share({ title: `메가존 구내식당 ${dateStr}`, url });
      return 'shared';
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return 'cancelled';
      return 'error';
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'error';
  }
};
