import { OrderDetailClient } from '@/components/order-detail-client';
import { getOrderById } from '@/lib/orders';
import { notFound } from 'next/navigation';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <OrderDetailClient order={order} />
    </div>
  );
}
