import type React from 'react';
import { CartProvider } from '@/components/cart-provider';
import { WishlistProvider } from '@/components/wishlist-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppFab } from '@/components/whatsapp-fab';
import { CookieNotice } from '@/components/cookie-notice';

/**
 * Storefront shell: header, footer, WhatsApp button and cookie notice only
 * exist here. The admin panel lives outside this route group
 * (`app/admin/...`), so it renders with just the panel chrome.
 *
 * The root layout keeps the document, fonts, theme and auth providers.
 */
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WishlistProvider>
      <CartProvider>
        <Header />
        {children}
        <Footer />
        <WhatsAppFab />
        <CookieNotice />
      </CartProvider>
    </WishlistProvider>
  );
}
