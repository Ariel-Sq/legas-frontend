'use server';

import { getOrderById } from './orders';

/**
 * Server action for the checkout success page: returns the real status of the
 * order MP sent the shopper back with, so the page doesn't claim "paid" before
 * the webhook has processed it.
 */
export async function getOrderStatusAction(
  id: string
): Promise<{ status: string; orderNumber: string } | null> {
  const order = await getOrderById(id);
  if (!order) return null;
  return { status: order.status, orderNumber: order.orderNumber };
}
