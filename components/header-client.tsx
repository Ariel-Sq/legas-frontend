'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';

interface HeaderNavProps {
  isAdmin?: boolean;
}

export function HeaderNav({ isAdmin }: HeaderNavProps) {
  const { t } = useLanguage();

  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link
        href="/shop"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        {t.header.shop}
      </Link>
      <Link
        href="/about"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        {t.header.about}
      </Link>
      <Link
        href="/contact"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        {t.header.contact}
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          {t.header.admin}
        </Link>
      )}
    </nav>
  );
}
