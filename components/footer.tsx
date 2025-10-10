'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/shipping"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t.footer.shipping} & {t.footer.returns}
            </Link>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-right">
            © 2025 Woodland. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
