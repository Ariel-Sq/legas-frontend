'use client';

import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSession } from 'next-auth/react';
import {
  type WishlistItem,
  type WishlistProductInput,
} from '@/lib/wishlist';
import {
  fetchWishlist,
  addToWishlistAction,
  removeFromWishlistAction,
} from '@/lib/wishlist-api';
import { SignInPromptDialog } from '@/components/sign-in-prompt-dialog';

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  isAuthenticated: boolean;
  addToWishlist: (product: WishlistProductInput) => void;
  removeFromWishlist: (productVariationId: string) => void;
  toggleWishlist: (product: WishlistProductInput) => void;
  isInWishlist: (productVariationId: string) => boolean;
  promptSignIn: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const isAuthenticated = !!userId;

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [signInOpen, setSignInOpen] = useState(false);
  const prevUserIdRef = useRef<string | undefined>('__initial__' as any);

  useEffect(() => {
    if (status === 'loading') return;
    if (prevUserIdRef.current === userId) return;
    prevUserIdRef.current = userId;

    if (!userId) {
      setItems([]);
      return;
    }
    fetchWishlist(userId).then(setItems);
  }, [userId, status]);

  const promptSignIn = useCallback(() => setSignInOpen(true), []);

  const addToWishlist = useCallback(
    (product: WishlistProductInput) => {
      if (!userId) {
        setSignInOpen(true);
        return;
      }
      const optimistic: WishlistItem = {
        wishlistItemId: `optimistic-${product.productVariationId}`,
        productVariationId: product.productVariationId,
        templateId: product.templateId ?? '',
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category ?? '',
        addedAt: new Date(),
      };
      setItems((current) =>
        current.some((i) => i.productVariationId === product.productVariationId)
          ? current
          : [...current, optimistic],
      );
      addToWishlistAction(userId, product.productVariationId).then((saved) => {
        if (saved) {
          setItems((current) =>
            current.map((i) =>
              i.productVariationId === product.productVariationId ? saved : i,
            ),
          );
        }
      });
    },
    [userId],
  );

  const removeFromWishlist = useCallback(
    (productVariationId: string) => {
      if (!userId) return;
      setItems((current) =>
        current.filter((i) => i.productVariationId !== productVariationId),
      );
      removeFromWishlistAction(userId, productVariationId);
    },
    [userId],
  );

  const toggleWishlist = useCallback(
    (product: WishlistProductInput) => {
      if (!userId) {
        setSignInOpen(true);
        return;
      }
      const already = items.some(
        (i) => i.productVariationId === product.productVariationId,
      );
      if (already) {
        removeFromWishlist(product.productVariationId);
      } else {
        addToWishlist(product);
      }
    },
    [userId, items, addToWishlist, removeFromWishlist],
  );

  const isInWishlist = useCallback(
    (productVariationId: string) =>
      items.some((i) => i.productVariationId === productVariationId),
    [items],
  );

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        isAuthenticated,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        promptSignIn,
      }}
    >
      {children}
      <SignInPromptDialog
        open={signInOpen}
        onOpenChange={setSignInOpen}
        title="Iniciá sesión para guardar favoritos"
        description="Tu lista de deseos se sincroniza con tu cuenta para que la encuentres en cualquier dispositivo."
      />
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
