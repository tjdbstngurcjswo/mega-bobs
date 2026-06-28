import { sendGAEvent } from '@next/third-parties/google';

export const trackEvent = (...args: Parameters<typeof sendGAEvent>): void => {
  if (process.env.NODE_ENV !== 'production') return;
  sendGAEvent(...args);
};
