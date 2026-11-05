'use server';

import { getOrderById, verifyOrderPayment } from './orders';

/**
 * Server action for the checkout success page: returns the real status of the
 * order MP sent the shopper back with, so the page doesn't claim "paid" before
 * the webhook has processed it.
 */
export async function getOrderStatusAction(
  id: string,
  /** MercadoPago's `payment_id` from the back_url. */
  paymentId?: string
): Promise<{ status: string; orderNumber: string } | null> {
  // Re-read the payment before trusting the order: MercadoPago redirects as
  // soon as the payment is approved, but the webhook may arrive seconds later.
  if (paymentId) {
    await verifyOrderPayment(id, paymentId);
  }
  const order = await getOrderById(id);
  if (!order) return null;
  return { status: order.status, orderNumber: order.orderNumber };
}
