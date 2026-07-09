import { createHmac } from 'crypto';
import { describe, expect, it } from 'vitest';

import { verifySlackSignature } from './verifySlackSignature';

const SECRET = 'test-signing-secret';

const sign = (timestamp: string, rawBody: string) =>
  `v0=${createHmac('sha256', SECRET)
    .update(`v0:${timestamp}:${rawBody}`)
    .digest('hex')}`;

describe('verifySlackSignature', () => {
  it('returns true for a valid signature', () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const rawBody = 'text=오늘';

    expect(
      verifySlackSignature(rawBody, timestamp, sign(timestamp, rawBody), SECRET)
    ).toBe(true);
  });

  it('returns false for an incorrect signature', () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();

    expect(
      verifySlackSignature('text=오늘', timestamp, 'v0=deadbeef', SECRET)
    ).toBe(false);
  });

  it('returns false for an expired timestamp', () => {
    const timestamp = '1000000000';
    const rawBody = 'text=오늘';

    expect(
      verifySlackSignature(rawBody, timestamp, sign(timestamp, rawBody), SECRET)
    ).toBe(false);
  });

  it('returns false when timestamp or signature header is missing', () => {
    expect(verifySlackSignature('text=오늘', null, 'v0=abc', SECRET)).toBe(
      false
    );
    expect(verifySlackSignature('text=오늘', '123', null, SECRET)).toBe(false);
  });
});
