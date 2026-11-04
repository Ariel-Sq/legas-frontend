import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const TAGS = ['catalog', 'hero'] as const;
type Tag = (typeof TAGS)[number];

/**
 * On-demand cache purge for the storefront. The panel lives in another
 * deployment (`legas-admin`), so it can't call `revalidateTag` directly: it
 * POSTs here after saving a product or the home banner.
 *
 * Call: POST /api/revalidate?secret=<REVALIDATE_SECRET>&tag=catalog|hero
 * (`tag` defaults to catalog.)
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

  const requested = req.nextUrl.searchParams.get('tag') ?? 'catalog';
  const tag: Tag = (TAGS as readonly string[]).includes(requested)
    ? (requested as Tag)
    : 'catalog';

  revalidateTag(tag);
  return NextResponse.json({ ok: true, revalidated: tag });
}
