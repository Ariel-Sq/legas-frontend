import type React from 'react';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import { CartProvider } from '@/components/cart-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { WishlistProvider } from '@/components/wishlist-provider';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsAppFab } from '@/components/whatsapp-fab';
import { Toaster } from 'sonner';
import { SITE_URL } from '@/utils/environments';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Legas — Muebles de Madera Artesanales',
    template: '%s | Legas Muebles',
  },
  description:
    'Muebles de madera artesanales: mesas de comedor de petiribí y álamo macizo, sillas, racks, escritorios y más. Fabricación propia, envíos coordinados.',
  keywords: [
    'muebles de madera',
    'muebles artesanales',
    'mesa de comedor petiribí',
    'mesa de comedor álamo',
    'muebles macizos argentina',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Legas Muebles',
    title: 'Legas — Muebles de Madera Artesanales',
    description:
      'Muebles de madera artesanales: mesas de comedor de petiribí y álamo macizo, sillas, racks, escritorios y más.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: '2KzkjEWbat0SaO3zZCsdszOEE3mkk693x7e4J7emBVM',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans ${workSans.variable} ${GeistMono.variable}`}>
        {/* Apply the user's palette (see components/palette-picker.tsx)
            before first paint so there is no flash of default colors. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var c=localStorage.getItem('legas-palette-css');if(c){var s=document.createElement('style');s.id='palette-style';s.textContent=c;document.head.appendChild(s);}}catch(e){}`,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Header />
                {children}
                <Footer />
                <WhatsAppFab />
                <Toaster position="top-center" richColors />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
