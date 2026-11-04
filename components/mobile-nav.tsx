'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Home, ShoppingBag, Mail, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  // next-themes resolves on the client; avoid a hydration mismatch by
  // rendering the neutral state until mounted.
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';

  const navItems = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/shop', label: 'Productos', icon: ShoppingBag },
    // 'Nosotros' hidden until it has real content — see TODO.md
    { href: '/contact', label: 'Contacto', icon: Mail },
  ];

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-6">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">Legas</SheetTitle>
        </SheetHeader>
        {/* Search — the header SearchBar is hidden on mobile, so this is the
            only way to search from a phone. */}
        <form onSubmit={submitSearch} className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar productos"
          />
        </form>
        <Separator className="mb-6" />
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Separator className="my-6" />

        {/* Theme switch: removed from the header on phones, where it collided
            with the logo. */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all hover:bg-primary/10 hover:text-primary"
        >
          {isDark ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          Tema: {isDark ? 'oscuro' : 'claro'}
        </button>
      </SheetContent>
    </Sheet>
  );
}
