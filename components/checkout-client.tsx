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
  AlertTriangle,
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

  // Pre-fill from the logged-in user (NextAuth session is merged with the
  // backend User record in lib/auth.ts, so firstName/lastName/address/etc.
  // come along for the ride). Only fills empty fields so a user mid-edit
  // doesn't get their changes clobbered when the session arrives.
  useEffect(() => {
    const u = session?.user as
      | (typeof session.user & {
          firstName?: string;
          lastName?: string;
          phoneNumber?: string;
          address?: string;
          city?: string;
          zipCode?: string;
          country?: string;
        })
      | undefined;
    if (!u) return;
    const fullName =
      [u.firstName, u.lastName].filter(Boolean).join(' ').trim() ||
      u.name ||
      '';
    setFormData((prev) => ({
      fullName: prev.fullName || fullName,
      email: prev.email || u.email || '',
      address: prev.address || u.address || '',
      city: prev.city || u.city || '',
      postalCode: prev.postalCode || u.zipCode || '',
      country: prev.country || u.country || '',
      phone: prev.phone || u.phoneNumber || '',
    }));
  }, [session]);

  const total = subtotal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const phoneValid = formData.phone.trim().length >= 6;
  const canContinueToPayment = emailValid && phoneValid;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinueToPayment) return;
    setCurrentStep(2);
  };

  useEffect(() => {
    if (currentStep !== 2) return;

    const setupPayment = async () => {
      setIsCreatingPreference(true);
      setError('');
      try {
        const id = await createCheckoutPreference(userId, {
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim(),
        });
        setPreferenceId(id);
      } catch (err: any) {
        setError(err.message || 'Error al iniciar el pago');
      } finally {
        setIsCreatingPreference(false);
      }
    };

    setupPayment();
  }, [currentStep, userId, formData.email, formData.phone]);

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
          <h1 className="mb-4 text-3xl font-bold">Tu carrito está vacío</h1>
          <p className="mb-8 text-muted-foreground">
            Agregá productos al carrito antes de pasar a pagar.
          </p>
          <Button asChild>
            <Link href="/shop">Seguir comprando</Link>
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
                Volver al carrito
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-4 mb-2">Finalizar compra</h1>

            {!userId && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
                <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-500 flex-shrink-0" />
                <div className="text-sm space-y-1">
                  <p className="font-medium text-foreground">
                    Estás comprando sin cuenta
                  </p>
                  <p className="text-muted-foreground">
                    Tu pedido va a quedar asociado solo a este navegador.
                    Si borrás cookies o cambiás de dispositivo, no vas a
                    poder ver el estado en{' '}
                    <Link href="/orders" className="underline">
                      Mis pedidos
                    </Link>
                    . Igual te vamos a contactar por WhatsApp con el
                    teléfono que dejes acá abajo, así que cualquier
                    coordinación o duda la resolvemos por ahí.
                  </p>
                  <p className="text-muted-foreground pt-1">
                    Te conviene{' '}
                    <Link
                      href="/api/auth/signin"
                      className="text-primary underline font-medium"
                    >
                      iniciar sesión con Google
                    </Link>{' '}
                    para tener todo tu historial siempre a mano.
                  </p>
                </div>
              </div>
            )}

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
                <span className="font-medium">Envío</span>
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
                <span className="font-medium">Pago</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {currentStep === 1 && (
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Datos de envío
                  </h2>
                  <form
                    onSubmit={handleShippingSubmit}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <div className="sm:col-span-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                      Solo necesitamos tu email y teléfono para coordinar el
                      envío. El resto es opcional.
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="juan@ejemplo.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        aria-invalid={!emailValid && formData.email.length > 0}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="phone">
                        Teléfono <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+54 11 1234-5678"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        aria-invalid={!phoneValid && formData.phone.length > 0}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="fullName">Nombre completo</Label>
                      <Input
                        id="fullName"
                        placeholder="Juan Pérez"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        placeholder="Av. Corrientes 1234"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        placeholder="Buenos Aires"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Código postal</Label>
                      <Input
                        id="postalCode"
                        placeholder="C1043"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        placeholder="Argentina"
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={!canContinueToPayment}
                      >
                        Continuar al pago
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {currentStep === 2 && (
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Método de pago
                  </h2>
                  {isCreatingPreference && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="ml-3 text-muted-foreground">
                        Preparando el pago...
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
                    Volver al envío
                  </Button>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-lg border bg-card p-6 sticky top-4">
                <h2 className="mb-4 text-xl font-semibold">Resumen del pedido</h2>

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
                          Cantidad: {item.quantity}
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
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-muted-foreground text-center bg-muted p-3 rounded-lg">
                  El envío se coordina con el vendedor después de la compra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
