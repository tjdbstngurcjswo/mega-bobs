import {revalidatePath} from 'next/cache';
import {NextRequest} from 'next/server';

const DEFAULT_PATHS = ['/'];

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {'Content-Type': 'application/json'},
  });

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => ({}));
    const paths: string[] =
      Array.isArray(payload?.paths) && payload.paths.length > 0
        ? payload.paths
        : DEFAULT_PATHS;

    paths.forEach((path) => revalidatePath(path));

    return jsonResponse({success: true, paths});
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({success: false, message}, 500);
  }
}
