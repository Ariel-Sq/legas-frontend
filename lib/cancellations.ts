'use server';

import { BACKEND_URL } from '@/utils/environments';
import { frontendKeyHeaders } from '@/utils/frontend-key';

export interface CancellationInput {
  name: string;
  email: string;
  phone?: string;
  orderId?: string;
  message?: string;
}

export interface CancellationResult {
  code?: string;
  error?: string;
}

/**
 * Registers a purchase-revocation request (botón de arrepentimiento,
 * Resolución 424/2020) and returns the trámite code. Errors are returned,
 * not thrown — Next.js masks thrown Server Action errors in production.
 */
export async function createCancellation(
  input: CancellationInput
): Promise<CancellationResult> {
  try {
    const body: Record<string, string> = {
      name: input.name,
      email: input.email,
    };
    if (input.phone) body.phone = input.phone;
    if (input.orderId) body.orderId = input.orderId;
    if (input.message) body.message = input.message;

    const resp = await fetch(`${BACKEND_URL}/api/cancellations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...frontendKeyHeaders() },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!resp.ok) {
      const error = await resp.json().catch(() => ({}));
      return {
        error: Array.isArray(error?.message)
          ? error.message.join(', ')
          : error?.message ||
            'No pudimos registrar tu solicitud. Intentá de nuevo o escribinos por WhatsApp.',
      };
    }

    const data = await resp.json();
    return { code: data.code };
  } catch (err) {
    console.error('createCancellation failed', err);
    return {
      error:
        'No pudimos registrar tu solicitud. Intentá de nuevo o escribinos por WhatsApp.',
    };
  }
}
