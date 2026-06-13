'use client';

import { useEffect } from 'react';

const BYPASS_KEY = 'vbp';
const BYPASS_PARAM = 'x-vercel-protection-bypass';

const sendToken = (token: string) => {
  navigator.serviceWorker.controller?.postMessage({ type: 'SET_BYPASS', token });
};

const VercelBypassSW = () => {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get(BYPASS_PARAM);
    const token = urlToken ?? sessionStorage.getItem(BYPASS_KEY);

    if (!token) return;
    if (urlToken) sessionStorage.setItem(BYPASS_KEY, urlToken);

    const onControllerChange = () => sendToken(token);
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    navigator.serviceWorker.register('/sw.js').then(() => {
      sendToken(token);

      if (urlToken) {
        navigator.serviceWorker.ready.then(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete(BYPASS_PARAM);
          window.location.replace(url.toString());
        });
      }
    });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  return null;
};

export default VercelBypassSW;
