"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import {
  type CartItem,
  calculateCartTotals,
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateCartItemQuantity as updateCartItemQuantityUtil,
} from "@/lib/cart"

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addToCart: (
    product: { id: number; name: string; price: number; image: string; category: string },
    quantity?: number,
  ) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartItem: (productId: number) => CartItem | undefined
  isInCart: (productId: number) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [itemCount, setItemCount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("woodland-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Update totals and save to localStorage whenever items change
  useEffect(() => {
    const { total: calculatedSubtotal, itemCount: newItemCount } = calculateCartTotals(items)
    setSubtotal(calculatedSubtotal)
    setItemCount(newItemCount)

    // Save to localStorage
    localStorage.setItem("woodland-cart", JSON.stringify(items))
  }, [items])

  const addToCart = (
    product: { id: number; name: string; price: number; image: string; category: string },
    quantity = 1,
  ) => {
    setItems((currentItems) => addToCartUtil(currentItems, product, quantity))
  }

  const removeFromCart = (productId: number) => {
    setItems((currentItems) => removeFromCartUtil(currentItems, productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    setItems((currentItems) => updateCartItemQuantityUtil(currentItems, productId, quantity))
  }

  const clearCart = () => {
    setItems([])
  }

  const getCartItem = (productId: number) => {
    return items.find((item) => item.id === productId)
  }

  const isInCart = (productId: number) => {
    return items.some((item) => item.id === productId)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
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
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
