import type React from 'react';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
import { CartProvider } from '@/components/cart-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { WishlistProvider } from '@/components/wishlist-provider';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'LtecDeco - Muebles de Madera Artesanales',
  description:
    'Descubre muebles de madera artesanales que aportan calidez, belleza y carácter a tu hogar.',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans ${workSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Suspense fallback={null}>
                  <Header />
                  {children}
                  <Footer />
                </Suspense>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
