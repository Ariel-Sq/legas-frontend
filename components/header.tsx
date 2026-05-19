import Link from 'next/link';
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
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                />
              </svg>
              <h1 className="text-2xl font-bold">Legas</h1>
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
