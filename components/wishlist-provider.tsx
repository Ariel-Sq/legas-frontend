'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import {
  type WishlistItem,
  type WishlistProductInput,
  addToWishlist as addToWishlistUtil,
  removeFromWishlist as removeFromWishlistUtil,
  toggleWishlistItem as toggleWishlistItemUtil,
} from '@/lib/wishlist';

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  addToWishlist: (product: WishlistProductInput) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: WishlistProductInput) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'ltecdeco-wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      const itemsWithDates = parsed
        .filter((item: WishlistItem) => typeof item.id === 'string')
        .map((item: WishlistItem) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
      setItems(itemsWithDates);
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    setItemCount(items.length);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: WishlistProductInput) => {
    setItems((currentItems) => addToWishlistUtil(currentItems, product));
  };

  const removeFromWishlist = (productId: string) => {
    setItems((currentItems) => removeFromWishlistUtil(currentItems, productId));
  };

  const toggleWishlist = (product: WishlistProductInput) => {
    setItems((currentItems) => toggleWishlistItemUtil(currentItems, product));
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
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
