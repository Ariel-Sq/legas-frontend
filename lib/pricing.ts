/**
 * Price display model.
 *
 * Stored catalogue prices are the list price ("precio de lista"). Card /
 * MercadoPago payers pay that list price, split into interest-free
 * installments. Cash / transfer payers get a discount.
 *
 * Keep these constants in sync with the backend
 * (ecommerce-backend/src/payments/payment-method.config.ts).
 */
export const INSTALLMENT_COUNT = 6;
export const TRANSFER_DISCOUNT_RATE = 0.3;

/** Cash / transfer price. e.g. 100000 → 70000. */
export function transferPrice(price: number): number {
  return price * (1 - TRANSFER_DISCOUNT_RATE);
}

/** Amount charged per installment for the interest-free plan. */
export function installmentAmount(price: number): number {
  return price / INSTALLMENT_COUNT;
}
