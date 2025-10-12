import Link from 'next/link';

interface HeaderNavProps {
  isAdmin: boolean;
}

export function HeaderNav({ isAdmin }: HeaderNavProps) {
  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link
        href="/shop"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Tienda
      </Link>
      <Link
        href="/about"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Nosotros
      </Link>
      <Link
        href="/contact"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Contacto
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Admin
        </Link>
      )}
    </nav>
  );
}
