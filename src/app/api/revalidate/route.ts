import { revalidatePath, revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/revalidate
 * @query secret - REVALIDATE_SECRET (env)
 * @returns `{ revalidated: true, now }` — '/' 경로와 'menu' 태그 강제 재검증
 */
export const GET = async (request: NextRequest) => {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET)
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });

  revalidatePath('/');
  revalidateTag('menu');

  return NextResponse.json({ revalidated: true, now: Date.now() });
};
