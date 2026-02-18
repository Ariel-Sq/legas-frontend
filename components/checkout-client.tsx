'use client';

import type React from 'react';

import { useCart } from '@/components/cart-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { createCheckoutPreference } from '@/lib/checkout';
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  CheckCircle,
  Package,
  Loader2,
} from 'lucide-react';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export function CheckoutClient() {
  const { items, subtotal } = useCart();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [currentStep, setCurrentStep] = useState(1);
  const [preferenceId, setPreferenceId] = useState('');
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const shippingCost = subtotal >= 500 ? 0 : 25;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  useEffect(() => {
    if (currentStep !== 2) return;

    const setupPayment = async () => {
      setIsCreatingPreference(true);
      setError('');
      try {
        const id = await createCheckoutPreference(userId);
        setPreferenceId(id);
      } catch (err: any) {
        setError(err.message || 'Error setting up payment');
      } finally {
        setIsCreatingPreference(false);
      }
    };

    setupPayment();
  }, [currentStep, userId]);

  useEffect(() => {
    if (!preferenceId || typeof window === 'undefined' || !window.MercadoPago)
      return;

    const mp = new window.MercadoPago(
      process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!,
      { locale: 'es-AR' }
    );

    mp.checkout({
      preference: { id: preferenceId },
      render: {
        container: '#payment-form',
        label: 'Pagar con MercadoPago',
      },
    });
  }, [preferenceId]);

  if (items.length === 0) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="mb-4 text-3xl font-bold">Your cart is empty</h1>
          <p className="mb-8 text-muted-foreground">
            Add some products to your cart before checking out.
          </p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Script src="https://sdk.mercadopago.com/js/v2" />
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/cart">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-4 mb-2">Checkout</h1>

            <div className="flex items-center gap-4 mb-8">
              <div
                className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  {currentStep > 1 ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    '1'
                  )}
                </div>
                <span className="font-medium">Shipping</span>
              </div>
              <div className="flex-1 h-px bg-border" />
              <div
                className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  2
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {currentStep === 1 && (
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </h2>
                  <form
                    onSubmit={handleShippingSubmit}
                    className="grid gap-4 sm:grid-cols-2"
                  >
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
                      <Input
                        id="city"
                        placeholder="Buenos Aires"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        placeholder="1000"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Argentina"
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+54 11 1234-5678"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Button type="submit" className="w-full" size="lg">
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {currentStep === 2 && (
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </h2>
                  {isCreatingPreference && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="ml-3 text-muted-foreground">
                        Setting up payment...
                      </span>
                    </div>
                  )}
                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-4 text-destructive text-sm mb-4">
                      {error}
                    </div>
                  )}
                  <div id="payment-form"></div>
                  <Button
                    variant="ghost"
                    className="mt-4"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Shipping
                  </Button>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-lg border bg-card p-6 sticky top-4">
                <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
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
                    <span className="font-medium">
                      {shippingCost === 0
                        ? 'FREE'
                        : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal > 0 && subtotal < 500 && (
                  <p className="mt-4 text-xs text-muted-foreground text-center bg-muted p-3 rounded-lg">
                    Add ${(500 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
