"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useWishlist } from "@/components/wishlist-provider"
import { useCart } from "@/components/cart-provider"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist()
  const { items: cartItems, addToCart, updateQuantity, removeFromCart, getCartItem } = useCart()
  const [cartStates, setCartStates] = useState<Record<number, { inCart: boolean; quantity: number }>>({})

  useEffect(() => {
    const states: Record<number, { inCart: boolean; quantity: number }> = {}
    items.forEach((item) => {
      const cartItem = getCartItem(item.id)
      states[item.id] = {
        inCart: !!cartItem,
        quantity: cartItem?.quantity || 1,
      }
    })
    setCartStates(states)
  }, [items, cartItems, getCartItem])

  const handleAddToCart = (item: (typeof items)[0]) => {
    const cartItem = getCartItem(item.id)
    if (cartItem) {
      // Item already in cart, update quantity
      updateQuantity(item.id, cartItem.quantity + 1)
    } else {
      // Add new item to cart
      addToCart(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
        },
        1,
      )
    }
  }

  const handleRemoveFromCart = (itemId: number) => {
    removeFromCart(itemId)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary" />
              Mi Lista de Deseos
            </h1>
            <p className="text-muted-foreground mt-2">
              {items.length} {items.length === 1 ? "producto" : "productos"} guardados
            </p>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart className="h-24 w-24 text-muted-foreground/30 mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Tu lista de deseos está vacía</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Explora nuestra colección y guarda tus productos favoritos para más tarde
              </p>
              <Button asChild size="lg">
                <Link href="/shop">Explorar Productos</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => {
                const cartState = cartStates[item.id] || { inCart: false, quantity: 1 }
                return (
                  <div key={item.id} className="group relative bg-card rounded-lg shadow-md overflow-hidden">
                    <Link href={`/product/${item.id}`}>
                      <div className="relative w-full aspect-square">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/90 hover:bg-background flex items-center justify-center cursor-pointer shadow-md transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>

                    <div className="p-4">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
                      <p className="text-lg font-bold text-primary mt-2">${item.price}</p>

                      {cartState.inCart ? (
                        <Button
                          onClick={() => handleRemoveFromCart(item.id)}
                          variant="outline"
                          className="w-full mt-4 cursor-pointer"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Quitar del Carrito
                        </Button>
                      ) : (
                        <Button onClick={() => handleAddToCart(item)} className="w-full mt-4 cursor-pointer" size="sm">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Agregar al Carrito
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
