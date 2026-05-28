'use server';

import { BACKEND_URL } from '@/utils/environments';
import { getAuthHeaders } from './server-auth';

export interface ProfileUpdate {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface UpdateProfileResult {
  ok: boolean;
  status: number;
  message?: string;
}

// `userId` is kept for call-site compatibility but the backend resolves the
// target user from the Bearer token (PATCH /users/me).
export async function updateProfileAction(
  _userId: string,
  update: ProfileUpdate,
): Promise<UpdateProfileResult> {
  const resp = await fetch(`${BACKEND_URL}/api/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(update),
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
}
