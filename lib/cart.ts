// Cart types and utility functions

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  category: string
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// Calculate cart totals
export function calculateCartTotals(items: CartItem[]): {
  total: number
  itemCount: number
} {
  const itemCount = items.length
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return { total, itemCount }
}

// Add item to cart
export function addToCart(
  currentItems: CartItem[],
  product: { id: number; name: string; price: number; image: string; category: string },
  quantity = 1,
): CartItem[] {
  const existingItem = currentItems.find((item) => item.id === product.id)

  if (existingItem) {
    // Update quantity if item already exists
    return currentItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
  }

  // Add new item
  return [
    ...currentItems,
    {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      category: product.category,
    },
  ]
}

// Remove item from cart
export function removeFromCart(currentItems: CartItem[], productId: number): CartItem[] {
  return currentItems.filter((item) => item.id !== productId)
}

// Update item quantity
export function updateCartItemQuantity(currentItems: CartItem[], productId: number, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return removeFromCart(currentItems, productId)
  }

  return currentItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
}
