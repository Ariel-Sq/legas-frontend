'use client';

import type React from 'react';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useTransition,
} from 'react';
import { useSession } from 'next-auth/react';
import {
  type CartItem,
  type CartData,
  fetchCart,
  addToCartAction,
  updateCartItemAction,
  removeFromCartAction,
  clearCartAction,
} from '@/lib/cart';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  loading: boolean;
  addToCart: (
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
      category: string;
    },
    quantity?: number
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItem: (productId: string) => CartItem | undefined;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const initialLoadDone = useRef(false);

  function applyCartData(data: CartData) {
    setItems(data.items);
    setItemCount(data.itemCount);
    setSubtotal(data.subtotal);
  }

  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    fetchCart(userId).then((data) => {
      applyCartData(data);
      setLoading(false);
    });
  }, [userId]);

  const addToCart = useCallback(
    (
      product: {
        id: string;
        name: string;
        price: number;
        image: string;
        category: string;
      },
      quantity = 1
    ) => {
      startTransition(async () => {
        try {
          const data = await addToCartAction(product.id, quantity, userId);
          applyCartData(data);
        } catch (error) {
          console.error('Failed to add to cart:', error);
        }
      });
    },
    [userId]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const item = items.find((i) => i.id === productId);
      if (!item) return;
      startTransition(async () => {
        try {
          const data = await removeFromCartAction(item.cartItemId, userId);
          applyCartData(data);
        } catch (error) {
          console.error('Failed to remove from cart:', error);
        }
      });
    },
    [items, userId]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const item = items.find((i) => i.id === productId);
      if (!item) return;
      if (quantity <= 0) {
        startTransition(async () => {
          try {
            const data = await removeFromCartAction(item.cartItemId, userId);
            applyCartData(data);
          } catch (error) {
            console.error('Failed to remove from cart:', error);
          }
        });
        return;
      }
      startTransition(async () => {
        try {
          const data = await updateCartItemAction(item.cartItemId, quantity, userId);
          applyCartData(data);
        } catch (error) {
          console.error('Failed to update cart:', error);
        }
      });
    },
    [items, userId]
  );

  const clearCart = useCallback(() => {
    startTransition(async () => {
      try {
        await clearCartAction(userId);
        applyCartData({ items: [], itemCount: 0, subtotal: 0 });
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    });
  }, [userId]);

  const getCartItem = useCallback(
    (productId: string) => items.find((item) => item.id === productId),
    [items]
  );

  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        loading: loading || isPending,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItem,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
