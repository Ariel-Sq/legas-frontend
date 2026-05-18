export interface WishlistItem {
  id: string;
  variationId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  addedAt: Date;
}

export interface WishlistProductInput {
  id: string;
  variationId: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function addToWishlist(
  currentItems: WishlistItem[],
  product: WishlistProductInput
): WishlistItem[] {
  if (currentItems.some((item) => item.id === product.id)) {
    return currentItems;
  }
  return [
    ...currentItems,
    {
      id: product.id,
      variationId: product.variationId,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      addedAt: new Date(),
    },
  ];
}

export function removeFromWishlist(
  currentItems: WishlistItem[],
  productId: string
): WishlistItem[] {
  return currentItems.filter((item) => item.id !== productId);
}

export function toggleWishlistItem(
  currentItems: WishlistItem[],
  product: WishlistProductInput
): WishlistItem[] {
  if (currentItems.some((item) => item.id === product.id)) {
    return removeFromWishlist(currentItems, product.id);
  }
  return addToWishlist(currentItems, product);
}
