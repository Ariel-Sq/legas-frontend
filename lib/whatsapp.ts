import type { Order } from './orders-shared';
import { formatPrice } from '@/lib/utils';

/** Single source of truth for the shop's WhatsApp number (wa.me format). */
export const WHATSAPP_NUMBER = '5491134414929';

/** Same number, formatted for display. */
export const WHATSAPP_DISPLAY = '+54 11 3441-4929';

const DEFAULT_PHONE = WHATSAPP_NUMBER;

export function getWhatsAppPhone(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_PHONE || DEFAULT_PHONE;
}

export function whatsappUrl(message: string, phone?: string): string {
  const p = phone || getWhatsAppPhone();
  return `https://wa.me/${p}?text=${encodeURIComponent(message)}`;
}

export function buildOrderInquiryMessage(order: Order): string {
  const items = order.items.map((i) => `${i.name} x${i.quantity}`).join(', ');
  return `Hola Legas, quería consultar por mi pedido #${order.orderNumber} (${items}).`;
}

export function whatsappOrderUrl(order: Order): string {
  return whatsappUrl(buildOrderInquiryMessage(order));
}

export function buildProductInquiryMessage(
  productName: string,
  price?: number,
  quantity?: number,
): string {
  const qty = quantity && quantity > 1 ? ` (cantidad ${quantity})` : '';
  const priceStr =
    typeof price === 'number' ? ` (${formatPrice(price)})` : '';
  return `Hola Legas, me interesa "${productName}"${priceStr}${qty}. ¿Me podés dar más info?`;
}

export function whatsappProductInquiryUrl(
  productName: string,
  price?: number,
  quantity?: number,
): string {
  return whatsappUrl(buildProductInquiryMessage(productName, price, quantity));
}
