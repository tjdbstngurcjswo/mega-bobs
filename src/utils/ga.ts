import { sendGAEvent } from '@next/third-parties/google';
import { isbot } from 'isbot';

export const trackEvent = (...args: Parameters<typeof sendGAEvent>): void => {
  if (process.env.NODE_ENV !== 'production') return;
  if (typeof navigator !== 'undefined' && isbot(navigator.userAgent)) return;
  sendGAEvent(...args);
};
