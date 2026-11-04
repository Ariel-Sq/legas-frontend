import Link from 'next/link';

export function HeaderNav() {
  return (
    <nav className="hidden lg:flex items-center gap-8">
      <Link
        href="/shop"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Productos
      </Link>
      <Link
        href="/quienes-somos"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Quiénes somos
      </Link>
      <Link
        href="/contact"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Contacto
      </Link>
    </nav>
  );
}
