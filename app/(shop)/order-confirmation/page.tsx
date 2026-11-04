import { OrderConfirmationClient } from '@/components/order-confirmation-client';
import { getOrderById } from '@/lib/orders';
import { redirect } from 'next/navigation';

interface OrderConfirmationPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    redirect('/shop');
  }

  const order = await getOrderById(orderId);

  if (!order) {
    redirect('/shop');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <OrderConfirmationClient order={order} />
    </div>
  );
}
