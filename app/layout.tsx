import type React from "react"
import type { Metadata } from "next"
import { Work_Sans } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/components/cart-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { WishlistProvider } from "@/components/wishlist-provider"
import "./globals.css"

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Woodland - Handcrafted Wooden Furniture",
  description: "Discover handcrafted wooden furniture that brings warmth, beauty, and character to your home.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${workSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LanguageProvider>
            <WishlistProvider>
              <CartProvider>
                <Suspense fallback={null}>{children}</Suspense>
              </CartProvider>
            </WishlistProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
