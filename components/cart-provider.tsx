'use client';

import type React from 'react';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useOptimistic,
  useRef,
  startTransition,
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

type OptimisticAction =
  | { type: 'add'; item: CartItem }
  | { type: 'remove'; productId: string }
  | { type: 'update'; productId: string; quantity: number }
  | { type: 'clear' };

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

function optimisticReducer(
  currentItems: CartItem[],
  action: OptimisticAction
): CartItem[] {
  switch (action.type) {
    case 'add': {
      const existing = currentItems.find((i) => i.id === action.item.id);
      if (existing) {
        return currentItems.map((i) =>
          i.id === action.item.id
            ? { ...i, quantity: i.quantity + action.item.quantity }
            : i
        );
      }
      return [...currentItems, action.item];
    }
    case 'remove':
      return currentItems.filter((i) => i.id !== action.productId);
    case 'update':
      if (action.quantity <= 0) {
        return currentItems.filter((i) => i.id !== action.productId);
      }
      return currentItems.map((i) =>
        i.id === action.productId ? { ...i, quantity: action.quantity } : i
      );
    case 'clear':
      return [];
  }
}

function calcTotals(items: CartItem[]) {
  return {
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [serverItems, setServerItems] = useState<CartItem[]>([]);
  const [optimisticItems, setOptimisticItems] = useOptimistic<
    CartItem[],
    OptimisticAction
  >(serverItems, optimisticReducer);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const prevUserIdRef = useRef<string | undefined>('__initial__' as any);

  const { itemCount, subtotal } = calcTotals(optimisticItems);

  function applyCartData(data: CartData) {
    setServerItems(data.items);
  }

  useEffect(() => {
    if (status === 'loading') return;
    if (prevUserIdRef.current === userId) return;
    prevUserIdRef.current = userId;

    setLoading(true);
    fetchCart(userId).then((data) => {
      applyCartData(data);
      setLoading(false);
    });
  }, [userId, status]);

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
      const optimisticItem: CartItem = {
        id: product.id,
        cartItemId: '',
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        category: product.category,
        stock: 0,
      };

      startTransition(async () => {
        setOptimisticItems({ type: 'add', item: optimisticItem });
        try {
          const data = await addToCartAction(product.id, quantity, userId);
          applyCartData(data);
        } catch (error) {
          console.error('Failed to add to cart:', error);
        }
      });
    },
    [userId, setOptimisticItems]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const item = serverItems.find((i) => i.id === productId);
      if (!item) return;

      startTransition(async () => {
        setOptimisticItems({ type: 'remove', productId });
        try {
          const data = await removeFromCartAction(item.cartItemId, userId);
          applyCartData(data);
        } catch (error) {
          console.error('Failed to remove from cart:', error);
        }
      });
    },
    [serverItems, userId, setOptimisticItems]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const item = serverItems.find((i) => i.id === productId);
      if (!item) return;

      startTransition(async () => {
        setOptimisticItems({ type: 'update', productId, quantity });
        try {
          if (quantity <= 0) {
            const data = await removeFromCartAction(item.cartItemId, userId);
            applyCartData(data);
          } else {
            const data = await updateCartItemAction(
              item.cartItemId,
              quantity,
              userId
            );
            applyCartData(data);
          }
        } catch (error) {
          console.error('Failed to update cart:', error);
        }
      });
    },
    [serverItems, userId, setOptimisticItems]
  );

  const clearCart = useCallback(() => {
    startTransition(async () => {
      setOptimisticItems({ type: 'clear' });
      try {
        await clearCartAction(userId);
        applyCartData({ items: [], itemCount: 0, subtotal: 0 });
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    });
  }, [userId, setOptimisticItems]);

  const getCartItem = useCallback(
    (productId: string) =>
      optimisticItems.find((item) => item.id === productId),
    [optimisticItems]
  );

  const isInCart = useCallback(
    (productId: string) =>
      optimisticItems.some((item) => item.id === productId),
    [optimisticItems]
  );

  return (
    <CartContext.Provider
      value={{
        items: optimisticItems,
        itemCount,
        subtotal,
        loading,
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
