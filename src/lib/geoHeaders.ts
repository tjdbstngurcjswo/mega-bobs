import { NextRequest } from 'next/server';

export type GeoInfo = {
  ip: string | null;
  country: string | null;
};

export const extractGeo = (req: NextRequest): GeoInfo => ({
  ip:
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    null,
  country: req.headers.get('x-vercel-ip-country'),
});

export const isKoreaGeo = (geo: GeoInfo): boolean =>
  !geo.country || geo.country === 'KR';
