import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

/**
 * On-demand cache purge for the catalogue. The storefront caches catalogue
 * fetches with `next: { tags: ['catalog'] }`, so after the editor changes
 * products directly in the DB, this drops that cache immediately (otherwise
 * the old data lingers until the 60s revalidate window and deployments that
 * can still serve stale entries).
 *
 * Call: POST /api/revalidate?secret=<REVALIDATE_SECRET>
 */
export async function POST(req: NextRequest) {
  const secret =
    req.nextUrl.searchParams.get('secret') ||
    req.headers.get('x-revalidate-secret');
  if (
    !process.env.REVALIDATE_SECRET ||
    secret !== process.env.REVALIDATE_SECRET
  ) {
    return NextResponse.json(
      { ok: false, error: 'unauthorized' },
      { status: 401 }
    );
  }
  revalidateTag('catalog');
  return NextResponse.json({ ok: true, revalidated: 'catalog' });
}
