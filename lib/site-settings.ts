import { BACKEND_URL } from '@/utils/environments';
import { frontendKeyHeaders } from '@/utils/frontend-key';

/**
 * Shop-wide settings edited from the panel: marquee strip, which payment
 * methods are offered and the shipping hints. Cached for 60s with the
 * `settings` tag (the panel purges it after saving).
 */
export interface ShopSettings {
  marquee: { text: string; isActive: boolean; speed: number };
  payments: { mercadopago: boolean; transfer: boolean; cash: boolean };
  shipping: { cost: number; freeFrom: number; notes: string };
}

export const SETTINGS_FALLBACK: ShopSettings = {
  marquee: { text: '', isActive: false, speed: 40 },
  payments: { mercadopago: true, transfer: true, cash: true },
  shipping: { cost: 0, freeFrom: 0, notes: '' },
};

export async function getShopSettings(): Promise<ShopSettings> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/site/settings`, {
      headers: frontendKeyHeaders(),
      next: { revalidate: 60, tags: ['settings'] },
    });
    if (!res.ok) return SETTINGS_FALLBACK;

    const data = (await res.json()) as Partial<ShopSettings>;
    return {
      marquee: { ...SETTINGS_FALLBACK.marquee, ...(data.marquee ?? {}) },
      payments: { ...SETTINGS_FALLBACK.payments, ...(data.payments ?? {}) },
      shipping: { ...SETTINGS_FALLBACK.shipping, ...(data.shipping ?? {}) },
    };
  } catch (err) {
    console.error('getShopSettings: backend unreachable', err);
    return SETTINGS_FALLBACK;
  }
}
