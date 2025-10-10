// Wishlist types and utility functions

export interface WishlistItem {
  id: number
  name: string
  price: number
  image: string
  category: string
  addedAt: Date
}

// Add item to wishlist
export function addToWishlist(
  currentItems: WishlistItem[],
  product: { id: number; name: string; price: number; image: string; category: string },
): WishlistItem[] {
  const productId = Number(product.id)
  const existingItem = currentItems.find((item) => item.id === productId)

  if (existingItem) {
    // Item already in wishlist, don't add again
    return currentItems
  }

  // Add new item with ID as number
  return [
    ...currentItems,
    {
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      addedAt: new Date(),
    },
  ]
}

// Remove item from wishlist
export function removeFromWishlist(currentItems: WishlistItem[], productId: number): WishlistItem[] {
  const id = Number(productId)
  return currentItems.filter((item) => item.id !== id)
}

// Toggle item in wishlist
export function toggleWishlistItem(
  currentItems: WishlistItem[],
  product: { id: number; name: string; price: number; image: string; category: string },
): WishlistItem[] {
  const productId = Number(product.id)
  const existingItem = currentItems.find((item) => item.id === productId)

  if (existingItem) {
    return removeFromWishlist(currentItems, productId)
  }

  return addToWishlist(currentItems, product)
}
