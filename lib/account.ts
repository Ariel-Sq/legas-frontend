'use server';

import { BACKEND_URL } from '@/utils/environments';
import { getAuthHeaders } from './server-auth';

export interface DeleteAccountResult {
  ok: boolean;
  status: number;
  message?: string;
}

/**
 * Permanently deletes the logged-in user's account on the backend
 * (DELETE /api/users/me). The backend resolves the target from the Bearer
 * token, so no id is passed from the client.
 */
export async function deleteAccountAction(): Promise<DeleteAccountResult> {
  const headers = await getAuthHeaders();
  if (!('Authorization' in headers)) {
    return {
      ok: false,
      status: 401,
      message: 'Tenés que iniciar sesión para eliminar tu cuenta.',
    };
  }

  try {
    const resp = await fetch(`${BACKEND_URL}/api/users/me`, {
      method: 'DELETE',
      headers,
      cache: 'no-store',
    });

    if (resp.ok) {
      return { ok: true, status: resp.status };
    }

    let message: string | undefined;
    try {
      const body = await resp.json();
      message = Array.isArray(body?.message)
        ? body.message.join(', ')
        : body?.message;
    } catch {
      // ignore
    }
    return { ok: false, status: resp.status, message };
  } catch (err) {
    console.error('deleteAccountAction failed', err);
    return {
      ok: false,
      status: 0,
      message:
        'No pudimos eliminar la cuenta. Intentá de nuevo en unos minutos.',
    };
  }
}
