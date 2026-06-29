const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

export const trackServerEvent = async (
  eventName: string,
  params: Record<string, unknown> = {}
): Promise<void> => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA_API_SECRET;
  if (!measurementId || !apiSecret || process.env.NODE_ENV !== 'production')
    return;

  try {
    await fetch(
      `${GA_ENDPOINT}?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: 'server',
          events: [{ name: eventName, params }],
        }),
      }
    );
  } catch {
    // silent — GA 실패가 API 응답을 막으면 안 됨
  }
};
