'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import {
  type WishlistItem,
  addToWishlist as addToWishlistUtil,
  removeFromWishlist as removeFromWishlistUtil,
  toggleWishlistItem as toggleWishlistItemUtil,
} from '@/lib/wishlist';

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  addToWishlist: (product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  }) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  }) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [itemCount, setItemCount] = useState(0);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('woodland-wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        // Convert date strings back to Date objects
        const itemsWithDates = parsedWishlist.map((item: WishlistItem) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        setItems(itemsWithDates);
      } catch (error) {
        console.error('Failed to load wishlist from localStorage:', error);
      }
    }
  }, []);

  // Update count and save to localStorage whenever items change
  useEffect(() => {
    setItemCount(items.length);
    localStorage.setItem('woodland-wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  }) => {
    setItems((currentItems) => addToWishlistUtil(currentItems, product));
  };

  const removeFromWishlist = (productId: number) => {
    setItems((currentItems) => removeFromWishlistUtil(currentItems, productId));
  };

  const toggleWishlist = (product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  }) => {
    setItems((currentItems) => toggleWishlistItemUtil(currentItems, product));
  };

  const isInWishlist = (productId: number) => {
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
