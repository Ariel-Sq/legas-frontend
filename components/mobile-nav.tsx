'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Home, ShoppingBag, Info, Mail } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/shop', label: 'Tienda', icon: ShoppingBag },
    { href: '/about', label: 'Nosotros', icon: Info },
    { href: '/contact', label: 'Contacto', icon: Mail },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-6">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-bold">Woodland</SheetTitle>
        </SheetHeader>
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
