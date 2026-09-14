import Link from 'next/link';

export function HeaderNav() {
  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link
        href="/shop"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Productos
      </Link>
      {/* "Nosotros" hidden until it has real content — see TODO.md */}
      <Link
        href="/contact"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Contacto
      </Link>
    </nav>
  );
}
