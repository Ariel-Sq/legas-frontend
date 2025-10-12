import { OrdersClient } from '@/components/orders-client';
import { Footer } from '@/components/footer';
import { getUserOrders } from '@/lib/orders';

export default async function OrdersPage() {
  const orders = await getUserOrders();

  return (
    <div className="flex min-h-screen flex-col">
      <OrdersClient initialOrders={orders} />
      <Footer />
    </div>
  );
}
