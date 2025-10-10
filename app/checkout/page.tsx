"use client"

import type React from "react"

import { useCart } from "@/components/cart-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createOrder } from "@/lib/orders"

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  })

  const shippingCost = shippingMethod === "express" ? 50 : subtotal >= 500 ? 0 : 25
  const total = subtotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handlePlaceOrder = async () => {
    console.log("[v0] Creating order with MercadoPago")

    const order = await createOrder({
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shipping: {
        name: formData.fullName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
        method: shippingMethod,
        cost: shippingCost,
      },
      subtotal,
      shippingCost,
      total,
    })

    clearCart()

    router.push(`/order-confirmation?orderId=${order.id}`)
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="mb-4 text-3xl font-bold">Your cart is empty</h1>
            <p className="mb-8 text-muted-foreground">Add some products to your cart before checking out.</p>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Shipping Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" value={formData.city} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="10001"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="United States"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Shipping Method</h2>
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={(value) => setShippingMethod(value as "standard" | "express")}
                  className="space-y-3"
                >
                  <label
                    htmlFor="standard"
                    className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-accent"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <div>
                        <div className="font-medium">Standard Shipping</div>
                        <div className="text-sm text-muted-foreground">5-7 business days</div>
                      </div>
                    </div>
                    <div className="font-semibold">{subtotal >= 500 ? "FREE" : "$25"}</div>
                  </label>

                  <label
                    htmlFor="express"
                    className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-accent"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="express" id="express" />
                      <div>
                        <div className="font-medium">Express Shipping</div>
                        <div className="text-sm text-muted-foreground">2-3 business days</div>
                      </div>
                    </div>
                    <div className="font-semibold">$50</div>
                  </label>
                </RadioGroup>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
                <Button className="w-full bg-[#00b1ea] hover:bg-[#009dd1] text-white font-semibold py-6" size="lg">
                  <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 9.75c-.68 2.992-2.664 4.594-5.25 4.594-1.031 0-1.969-.313-2.719-.906l-.656 2.625h-1.5l1.594-6.375h1.5l-.094.375c.656-.563 1.5-.938 2.469-.938 1.406 0 2.344.75 2.344 2.063 0 .281-.031.562-.094.843h-4.5c-.094.469.188.938.844.938.656 0 1.219-.375 1.5-.938h1.562zm-4.5-1.313c-.469 0-.844.188-1.125.469l-.281 1.125h2.25c.031-.188.063-.375.063-.563 0-.563-.375-.938-.906-.938z" />
                  </svg>
                  Pay with MercadoPago
                </Button>
                <p className="mt-2 text-sm text-muted-foreground text-center">Secure payment processing</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-lg border bg-card p-6 sticky top-4">
                <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full mt-6" size="lg" onClick={handlePlaceOrder}>
                  Place Order
                </Button>

                <p className="mt-4 text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
