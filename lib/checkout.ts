'use server';

import { cookies } from 'next/headers';
import { BACKEND_URL } from '@/utils/environments';

async function getSessionId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('legas-session-id')?.value;
}

function buildHeaders(
  userId?: string,
  sessionId?: string
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (userId) {
    headers['x-user-id'] = userId;
  } else if (sessionId) {
    headers['x-session-id'] = sessionId;
  }
  return headers;
}

export async function createCheckoutPreference(
  userId?: string
): Promise<string> {
  const sessionId = await getSessionId();

  const response = await fetch(
    `${BACKEND_URL}/api/payments/mercadopago/checkout`,
    {
      method: 'POST',
      headers: buildHeaders(userId, sessionId),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Error creating checkout preference');
  }

  const data = await response.json();
  return data.id;
}
