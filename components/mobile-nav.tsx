'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Home, ShoppingBag, Mail, Search } from 'lucide-react';
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

  const navItems = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/shop', label: 'Tienda', icon: ShoppingBag },
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
      </SheetContent>
    </Sheet>
  );
}
