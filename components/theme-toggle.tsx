'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const next = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
      className="relative p-2 rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <Sun
        className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"
        suppressHydrationWarning
      />
      <Moon
        className="absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
        suppressHydrationWarning
      />
    </button>
  );
}
