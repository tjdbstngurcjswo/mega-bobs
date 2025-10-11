import {revalidatePath} from 'next/cache';

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {'Content-Type': 'application/json'},
  });

export default async function handler() {
  try {
    await revalidatePath('/');
    return jsonResponse({revalidated: true});
  } catch (err) {
    return jsonResponse({message: 'Error revalidating'}, 500);
  }
}
