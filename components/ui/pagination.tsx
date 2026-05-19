'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function Pagination({
  className,
  ...props
}: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="paginación"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  href: string;
} & React.ComponentProps<typeof Link>;

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'default' : 'ghost',
          size,
        }),
        'cursor-pointer',
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled?: boolean }) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        data-slot="pagination-previous"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'default' }),
          'gap-1 px-2.5 pointer-events-none opacity-50',
          className
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </span>
    );
  }
  return (
    <PaginationLink
      aria-label="Ir a la página anterior"
      size="default"
      className={cn('gap-1 px-2.5', className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Anterior</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { disabled?: boolean }) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        data-slot="pagination-next"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'default' }),
          'gap-1 px-2.5 pointer-events-none opacity-50',
          className
        )}
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="h-4 w-4" />
      </span>
    );
  }
  return (
    <PaginationLink
      aria-label="Ir a la página siguiente"
      size="default"
      className={cn('gap-1 px-2.5', className)}
      {...props}
    >
      <span className="hidden sm:inline">Siguiente</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        'flex h-9 w-9 items-center justify-center text-muted-foreground',
        className
      )}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">Más páginas</span>
    </span>
  );
}

/**
 * Build a compact list of page numbers with ellipses, e.g.:
 *   1, …, 4, 5, 6, …, 20
 * `total` is the total number of pages; `current` is the active page.
 */
export function buildPageList(
  current: number,
  total: number,
  siblings = 1
): (number | 'ellipsis')[] {
  if (total <= 1) return [1];
  const first = 1;
  const last = total;
  const pages = new Set<number>([first, last, current]);
  for (let i = 1; i <= siblings; i++) {
    if (current - i >= first) pages.add(current - i);
    if (current + i <= last) pages.add(current + i);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const out: (number | 'ellipsis')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    out.push(sorted[i]);
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      out.push('ellipsis');
    }
  }
  return out;
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
