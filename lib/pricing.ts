/**
 * Price display model.
 *
 * Stored catalogue prices are the cash / transfer price ("precio de
 * contado"). MercadoPago / card payers pay a 20% markup (list price).
 *
 * Keep these constants in sync with the backend
 * (ecommerce-backend/src/payments/payment-method.config.ts).
 */
export const INSTALLMENT_COUNT = 6;
export const LIST_PRICE_MARKUP = 0.20;

/** List price (card / MercadoPago). e.g. 100000 → 120000. */
export function listPrice(price: number): number {
  return price * (1 + LIST_PRICE_MARKUP);
}

/** Cash / transfer price (stored, no discount). */
export function transferPrice(price: number): number {
  return price;
}