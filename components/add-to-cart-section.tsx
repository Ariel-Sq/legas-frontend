'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { useWishlist } from '@/components/wishlist-provider';

interface AddToCartSectionProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    stock?: number;
  };
  wishlistId?: string;
  wishlistVariationId?: string;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

export function AddToCartSection({
  product,
  wishlistId,
  wishlistVariationId,
  quantity: controlledQuantity,
  onQuantityChange,
}: AddToCartSectionProps) {
  const [internalQuantity, setInternalQuantity] = useState(1);
  const quantity = controlledQuantity ?? internalQuantity;
  const setQuantity = (next: number) => {
    setInternalQuantity(next);
    onQuantityChange?.(next);
  };
  const { addToCart, removeFromCart, updateQuantity, getCartItem, isInCart } =
    useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const cartItem = getCartItem(product.id);
  const productInCart = isInCart(product.id);
  const inWishlist = wishlistId ? isInWishlist(wishlistId) : false;

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (!product.stock || quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddOrUpdateCart = () => {
    if (productInCart) {
      // Update quantity if product is already in cart
      updateQuantity(product.id, quantity);
    } else {
      // Add new product to cart
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
        },
        quantity
      );
    }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
    setQuantity(1); // Reset quantity to 1 after removing
  };

  const handleToggleWishlist = () => {
    if (!wishlistId || !wishlistVariationId) return;
    toggleWishlist({
      id: wishlistId,
      variationId: wishlistVariationId,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  const isOutOfStock = product.stock !== undefined && product.stock === 0;
  const quantityChanged = cartItem && cartItem.quantity !== quantity;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Cantidad:</span>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="h-10 w-10 flex items-center justify-center hover:bg-muted cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="h-10 w-12 flex items-center justify-center border-x">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={!!product.stock && quantity >= product.stock}
            className="h-10 w-10 flex items-center justify-center hover:bg-muted cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        {productInCart ? (
          <>
            <Button
              onClick={handleAddOrUpdateCart}
              disabled={!quantityChanged}
              className="flex-1 h-12 text-base cursor-pointer"
              size="lg"
              variant={quantityChanged ? 'default' : 'secondary'}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {quantityChanged ? 'Actualizar carrito' : 'En el carrito'}
            </Button>
            <Button
              onClick={handleRemoveFromCart}
              variant="destructive"
              size="lg"
              className="h-12 px-6 cursor-pointer"
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Quitar
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleAddOrUpdateCart}
              disabled={isOutOfStock}
              className="flex-1 h-12 text-base cursor-pointer"
              size="lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
            </Button>
            <Button
              onClick={handleToggleWishlist}
              variant="outline"
              size="lg"
              className="h-12 w-12 p-0 cursor-pointer bg-transparent"
            >
              <Heart
                className={`h-5 w-5 ${inWishlist ? 'fill-primary text-primary' : ''}`}
              />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
