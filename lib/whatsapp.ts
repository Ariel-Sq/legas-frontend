import type { Order } from './orders-shared';

const DEFAULT_PHONE = '5491173666370';

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
    typeof price === 'number' ? ` ($${price.toFixed(2)})` : '';
  return `Hola Legas, me interesa "${productName}"${priceStr}${qty}. ¿Me podés dar más info?`;
}

export function whatsappProductInquiryUrl(
  productName: string,
  price?: number,
  quantity?: number,
): string {
  return whatsappUrl(buildProductInquiryMessage(productName, price, quantity));
}
