/**
 * Price display model.
 *
 * Stored catalogue prices are the cash / transfer price (the "real" price
 * edited in the admin). MercadoPago / card payers pay a 20% markup (list
 * price). Cash / transfer payers pay the stored price with no markup.
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

/** Cash / transfer price (stored). Identity — the DB price is already the cash price. */
export function transferPrice(price: number): number {
  return price;
}

/** Amount charged per installment for the interest-free plan. */
export function installmentAmount(price: number): number {
  return listPrice(price) / INSTALLMENT_COUNT;
}