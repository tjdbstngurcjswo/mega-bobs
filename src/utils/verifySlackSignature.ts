import { createHmac, timingSafeEqual } from 'crypto';

const MAX_TIMESTAMP_DRIFT_SECONDS = 60 * 5;

export const verifySlackSignature = (
  rawBody: string,
  timestamp: string | null,
  signature: string | null,
  secret: string
): boolean => {
  if (!timestamp || !signature) return false;

  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds)) return false;

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - timestampSeconds) > MAX_TIMESTAMP_DRIFT_SECONDS) {
    return false;
  }

  const baseString = `v0:${timestamp}:${rawBody}`;
  const expectedSignature = `v0=${createHmac('sha256', secret)
    .update(baseString)
    .digest('hex')}`;

  const expectedBuffer = Buffer.from(expectedSignature);
  const actualBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== actualBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, actualBuffer);
};
