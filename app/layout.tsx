import type React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';
import { Toaster } from 'sonner';
import { SITE_URL } from '@/utils/environments';

// Self-hosted (app/fonts) so the build never depends on fetching Google Fonts.
const workSans = localFont({
  src: './fonts/WorkSans-Variable.woff2',
  variable: '--font-work-sans',
  weight: '400 800',
  display: 'swap',
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AuthProvider>
            {/* Storefront chrome lives in app/(shop)/layout.tsx; the admin
                panel renders without it. */}
            {children}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
