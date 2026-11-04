import type React from 'react';
import { CartProvider } from '@/components/cart-provider';
import { WishlistProvider } from '@/components/wishlist-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppFab } from '@/components/whatsapp-fab';
import { CookieNotice } from '@/components/cookie-notice';
import { MarqueeBar } from '@/components/marquee-bar';
import { getShopSettings } from '@/lib/site-settings';

/**
 * Storefront shell: header, footer, WhatsApp button and cookie notice.
 * The admin panel is a separate app (legas-admin, on admin.legasmuebles.com),
 * so nothing here leaks into it.
 *
 * The root layout keeps the document, fonts, theme and auth providers.
 */
export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getShopSettings();
  const marquee = settings.marquee;

  return (
    <WishlistProvider>
      <CartProvider>
        {marquee.isActive && marquee.text.trim() && (
          <MarqueeBar text={marquee.text} speed={marquee.speed} />
        )}
        <Header />
        {children}
        <Footer />
        <WhatsAppFab />
        <CookieNotice />
      </CartProvider>
    </WishlistProvider>
  );
}
