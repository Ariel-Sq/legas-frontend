import { OrderDetailClient } from '@/components/order-detail-client';
import { getOrderById } from '@/lib/orders';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getEffectiveUserId } from '@/lib/effective-user';
import { notFound } from 'next/navigation';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = getEffectiveUserId(session?.user?.id);
  const order = await getOrderById(id, userId);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <OrderDetailClient order={order} />
    </div>
  );
}
