export interface WishlistItem {
  wishlistItemId: string;
  productVariationId: string;
  templateId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  addedAt: Date;
}

export interface WishlistProductInput {
  productVariationId: string;
  templateId?: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}
