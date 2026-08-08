'use server';

import { BACKEND_URL } from '@/utils/environments';
import { frontendKeyHeaders } from '@/utils/frontend-key';

/**
 * Anonymous palette-choice counter (see TODO: learn the most-picked
 * palette). Fire-and-forget: never surfaces errors to the UI.
 */
export async function logPaletteChoice(
  base: string,
  accent: string
): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/metrics/palette`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...frontendKeyHeaders() },
      body: JSON.stringify({ base, accent }),
      cache: 'no-store',
    });
  } catch {
    // metrics must never break the UI
  }
}
