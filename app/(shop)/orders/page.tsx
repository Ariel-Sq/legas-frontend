import { OrdersClient } from '@/components/orders-client';
import { getUserOrders } from '@/lib/orders';
import { getMyReviewedVariationIds } from '@/lib/reviews';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const orders = await getUserOrders();
  const isAuthenticated = !!userId;
  const reviewedVariationIds = userId
    ? Array.from(await getMyReviewedVariationIds())
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <OrdersClient
        initialOrders={orders}
        isAuthenticated={isAuthenticated}
        userId={userId}
        reviewedVariationIds={reviewedVariationIds}
      />
    </div>
  );
}
