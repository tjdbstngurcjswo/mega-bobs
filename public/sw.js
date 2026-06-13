let bypassToken = null;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SET_BYPASS') {
    bypassToken = event.data.token;
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
