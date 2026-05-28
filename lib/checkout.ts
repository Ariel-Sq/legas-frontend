'use server';

import { cookies } from 'next/headers';
import { BACKEND_URL } from '@/utils/environments';
import { getAuthHeaders } from './server-auth';

async function getSessionId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('legas-session-id')?.value;
}

async function buildHeaders(sessionId?: string): Promise<Record<string, string>> {
  const auth = await getAuthHeaders();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...auth,
  };
  if (!('Authorization' in auth) && sessionId) {
    headers['x-session-id'] = sessionId;
  }
  return headers;
}

// `userId` is kept for call-site compatibility; identity is resolved
// server-side from the session (Bearer) or the anon session id.
export async function createCheckoutPreference(
  _userId?: string,
  contact?: { customerEmail?: string; customerPhone?: string },
): Promise<string> {
  const sessionId = await getSessionId();

  const body: Record<string, string> = {};
  if (contact?.customerEmail) body.customerEmail = contact.customerEmail;
  if (contact?.customerPhone) body.customerPhone = contact.customerPhone;

  const response = await fetch(
    `${BACKEND_URL}/api/payments/mercadopago/checkout`,
    {
      method: 'POST',
      headers: await buildHeaders(sessionId),
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Error creating checkout preference');
  }

  const data = await response.json();
  return data.id;
}
