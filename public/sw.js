const CACHE_NAME = 'vbp-v1';
let bypassToken = null;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const resp = await cache.match('token');
      if (resp) bypassToken = await resp.text();
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', async (event) => {
  if (event.data?.type === 'SET_BYPASS') {
    bypassToken = event.data.token;
    const cache = await caches.open(CACHE_NAME);
    await cache.put('token', new Response(bypassToken));
    event.ports[0]?.postMessage({ ok: true });
  }
});

self.addEventListener('fetch', (event) => {
  if (!bypassToken) return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const headers = new Headers(event.request.headers);
  headers.set('x-vercel-protection-bypass', bypassToken);

  event.respondWith(fetch(new Request(event.request, { headers })));
});
