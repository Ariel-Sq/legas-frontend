/**
 * Price display model.
 *
 * Stored catalogue prices are the cash / transfer price ("precio de
 * contado"). MercadoPago / card payers pay a 15% markup (list price).
 *
 * Keep these constants in sync with the backend
 * (ecommerce-backend/src/payments/payment-method.config.ts).
 */
export const INSTALLMENT_COUNT = 6;
export const LIST_PRICE_MARKUP = 0.15;

/** List price (card / MercadoPago). e.g. 100000 → 120000. */
export function listPrice(price: number): number {
  return price * (1 + LIST_PRICE_MARKUP);
}

/** Cash / transfer price (stored, no discount). */
export function transferPrice(price: number): number {
  return price;
}
/**
 * Pickup deposit: paying cash/transfer AND picking the order up at the shop
 * requires half the total up front by transfer; the rest is paid on pickup.
 * Exact half — no rounding. Shipments never use a deposit.
 */
export const PICKUP_DEPOSIT_RATE = 0.5;

/** Deposit to transfer when the order is picked up (cash/transfer). */
export function pickupDeposit(total: number): number {
  return Math.round(total * PICKUP_DEPOSIT_RATE * 100) / 100;
}
