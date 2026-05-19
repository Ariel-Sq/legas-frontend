'use client';

import { Search, X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';

const DEBOUNCE_MS = 350;

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery =
    searchParams?.get('q') ?? searchParams?.get('search') ?? '';

  // Seed local state from the URL so the input reflects the current ?q on
  // initial render and after server-side navigations. We track the URL value
  // we last synced from and re-sync during render whenever the URL changes —
  // this is the recommended React pattern for adjusting state to a changing
  // prop/input rather than mirroring via useEffect.
  const [query, setQuery] = useState(urlQuery);
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const isOnShop = pathname === '/shop';
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // While the user is on /shop, debounce typing into a URL update so the
  // visible product grid follows the query without requiring an Enter press.
  // Resets pagination back to page 1 when the query changes.
  useEffect(() => {
    if (!isOnShop) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const currentParam =
      searchParams?.get('q') ?? searchParams?.get('search') ?? '';
    const trimmed = query.trim();
    if (trimmed === currentParam) return;

    debounceRef.current = setTimeout(() => {
      const sp = new URLSearchParams();
      if (trimmed) sp.set('q', trimmed);
      const qs = sp.toString();
      router.replace(qs ? `/shop?${qs}` : '/shop');
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, isOnShop, router, searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    const target = trimmed
      ? `/shop?q=${encodeURIComponent(trimmed)}`
      : '/shop';
    router.push(target);
  };

  const handleClear = () => {
    setQuery('');
    if (isOnShop) {
      router.replace('/shop');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative hidden sm:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        className="w-full pl-10 pr-10 py-2 rounded-lg bg-muted/50 border-transparent focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm cursor-text"
        placeholder="Buscar productos..."
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar productos"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
