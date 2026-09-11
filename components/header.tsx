import Link from 'next/link';
import Image from 'next/image';
import { AuthSection } from '@/components/auth-section';
import { SearchBar } from '@/components/search-bar';
import { MobileNav } from '@/components/mobile-nav';
import { CartButton } from '@/components/cart-button';
import { HeaderNav } from '@/components/header-client';
import { WishlistButton } from '@/components/wishlist-button';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-3 text-foreground hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo-legas.png"
                alt="Legas Muebles"
                width={44}
                height={44}
                priority
                className="h-11 w-11 rounded-full"
              />
              <span className="text-2xl font-bold">Legas</span>
            </Link>
            <HeaderNav />
          </div>
          <div className="flex items-center gap-4">
            <SearchBar />
            <ThemeToggle />
            <WishlistButton />
            <CartButton />
            <AuthSection />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
