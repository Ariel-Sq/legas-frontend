import { Footer } from '@/components/footer';
import { CartContent } from '@/components/cart-content';

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <CartContent />
      <Footer />
    </div>
  );
}
