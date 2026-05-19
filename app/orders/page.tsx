import { OrdersClient } from '@/components/orders-client';
import { getUserOrders } from '@/lib/orders';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getEffectiveUserId } from '@/lib/effective-user';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const userId = getEffectiveUserId(session?.user?.id);
  const orders = await getUserOrders(userId);
  const isAuthenticated = !!userId;

  return (
    <div className="flex min-h-screen flex-col">
      <OrdersClient
        initialOrders={orders}
        isAuthenticated={isAuthenticated}
        userId={userId}
      />
    </div>
  );
}
