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
import {
  createCheckoutPreference,
  type CheckoutPaymentMethod,
} from '@/lib/checkout';
import { formatPrice } from '@/lib/utils';
import {
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  MapPin,
  CheckCircle,
  Package,
  Loader2,
  MessageCircle,
  RefreshCw,
} from 'lucide-react';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const WHATSAPP_NUMBER = '5491173666370';

/**
 * How the shopper pays. Catalogue prices are the cash/transfer prices.
 * Keep the MercadoPago rate in sync with the backend
 * (ecommerce-backend/src/payments/payment-method.config.ts).
 */
const MP_SURCHARGE_RATE = 0.2;
const PAYMENT_OPTIONS: {
  key: CheckoutPaymentMethod;
  rate: number;
  label: string;
  description: string;
}[] = [
  {
    key: 'mercadopago',
    rate: MP_SURCHARGE_RATE,
    label: 'MercadoPago',
    description:
      'Tarjeta, débito o dinero en cuenta. Hasta 3 cuotas. Recargo 20%.',
  },
  {
    key: 'offline',
    rate: 0,
    label: 'Transferencia o efectivo',
    description:
      'Precio de lista, sin recargo. Coordinamos el pago con vos por WhatsApp.',
  },
];

export function CheckoutClient() {
  const { items, subtotal, loading, clearCart } = useCart();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>('mercadopago');
  const [preferenceId, setPreferenceId] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState('');
  // Set once an offline order is placed → success screen with WhatsApp CTA.
  const [offlineOrderId, setOfflineOrderId] = useState('');

  const [formData, setFormData] = useState({ email: '', phone: '' });

  // Pre-fill contact from the logged-in user (session is merged with the
  // backend user in lib/auth.ts). Only fills empty fields.
  useEffect(() => {
    const u = session?.user as
      | (typeof session.user & { phoneNumber?: string })
      | undefined;
    if (!u) return;
    setFormData((prev) => ({
      email: prev.email || u.email || '',
      phone: prev.phone || u.phoneNumber || '',
    }));
  }, [session]);

  const surchargeRate =
    PAYMENT_OPTIONS.find((o) => o.key === paymentMethod)?.rate ?? 0;
  const surcharge = subtotal * surchargeRate;
  const total = subtotal + surcharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const phoneValid = formData.phone.trim().length >= 6;
  const canContinueToPayment = emailValid && phoneValid;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinueToPayment) return;
    setCurrentStep(2);
  };

  // MercadoPago: create the preference when the shopper lands on step 2 with
  // MP selected (or switches back to it). Offline places the order on click
  // instead (placeOfflineOrder), so it doesn't run here.
  useEffect(() => {
    if (currentStep !== 2 || paymentMethod !== 'mercadopago') return;

    const setupPayment = async () => {
      setIsWorking(true);
      setError('');
      setPreferenceId('');
      const container = document.getElementById('payment-form');
      if (container) container.innerHTML = '';
      const result = await createCheckoutPreference(
        userId,
        {
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim(),
        },
        'mercadopago'
      );
      if (result.error || !result.id) {
        setError(result.error || 'No pudimos iniciar el pago.');
      } else {
        setPreferenceId(result.id);
      }
      setIsWorking(false);
    };

    setupPayment();
  }, [currentStep, paymentMethod, userId, formData.email, formData.phone]);

  useEffect(() => {
    if (!preferenceId || typeof window === 'undefined' || !window.MercadoPago)
      return;
    const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: 'es-AR',
    });
    mp.checkout({
      preference: { id: preferenceId },
      render: { container: '#payment-form', label: 'Pagar con MercadoPago' },
    });
  }, [preferenceId]);

  const placeOfflineOrder = async () => {
    setIsWorking(true);
    setError('');
    const result = await createCheckoutPreference(
      userId,
      {
        customerEmail: formData.email.trim(),
        customerPhone: formData.phone.trim(),
      },
      'offline'
    );
    if (result.error || !result.orderId) {
      setError(result.error || 'No pudimos registrar el pedido.');
    } else {
      // Backend already cleared the cart; sync the client badge.
      clearCart();
      setOfflineOrderId(result.orderId);
    }
    setIsWorking(false);
  };

  // ----- Offline success screen -----
  if (offlineOrderId) {
    const shortId = offlineOrderId.slice(0, 8).toUpperCase();
    const waText = encodeURIComponent(
      `Hola Legas! Acabo de hacer el pedido ${shortId} para pagar por transferencia/efectivo. ¿Cómo coordinamos?`
    );
    return (
      <main className="flex-grow">
        <div className="container mx-auto max-w-lg px-4 py-16 text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="mb-2 text-3xl font-bold">¡Pedido registrado!</h1>
          <p className="mb-1 text-muted-foreground">
            Tu número de pedido es <strong>{shortId}</strong>.
          </p>
          <p className="mb-8 text-muted-foreground">
            Te reservamos los productos. Escribinos por WhatsApp y coordinamos
            el pago (transferencia o efectivo) y la entrega.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Coordinar por WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/orders">Ver mis pedidos</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // ----- Loading skeleton (cart still fetching) -----
  if (loading) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 w-48 rounded bg-muted animate-pulse mb-8" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-40 rounded-lg bg-muted animate-pulse" />
              <div className="h-40 rounded-lg bg-muted animate-pulse" />
            </div>
            <div className="h-64 rounded-lg bg-muted animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  // ----- Empty cart (only after loading resolves) -----
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
                    Tu pedido va a quedar asociado solo a este navegador. Si
                    borrás cookies o cambiás de dispositivo, no vas a poder ver
                    el estado en{' '}
                    <Link href="/orders" className="underline">
                      Mis pedidos
                    </Link>
                    . Igual te vamos a contactar por WhatsApp con el teléfono
                    que dejes acá abajo.
                  </p>
                  <p className="text-muted-foreground pt-1">
                    Te conviene{' '}
                    <Link
                      href="/api/auth/signin"
                      className="text-primary underline font-medium"
                    >
                      iniciar sesión con Google
                    </Link>{' '}
                    para tener tu historial siempre a mano.
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
                  {currentStep > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
                </div>
                <span className="font-medium">Datos</span>
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
                    Tus datos de contacto
                  </h2>
                  <form onSubmit={handleShippingSubmit} className="grid gap-4">
                    <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                      Con tu email y teléfono coordinamos el pago y la entrega
                      por WhatsApp. La dirección la arreglamos ahí, según la
                      zona.
                    </div>
                    <div>
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
                      {!emailValid && formData.email.length > 0 && (
                        <p className="mt-1 text-xs text-destructive">
                          Ingresá un email válido.
                        </p>
                      )}
                    </div>
                    <div>
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
                      {!phoneValid && formData.phone.length > 0 && (
                        <p className="mt-1 text-xs text-destructive">
                          Ingresá un teléfono para coordinar por WhatsApp.
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={!canContinueToPayment}
                    >
                      Continuar al pago
                    </Button>
                  </form>
                </div>
              )}

              {currentStep === 2 && (
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    ¿Cómo querés pagar?
                  </h2>

                  <div className="grid gap-3 sm:grid-cols-2 mb-6">
                    {PAYMENT_OPTIONS.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(option.key);
                          setError('');
                        }}
                        aria-pressed={paymentMethod === option.key}
                        className={`rounded-lg border p-4 text-left transition-colors cursor-pointer ${
                          paymentMethod === option.key
                            ? 'border-ring bg-secondary'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <p className="font-semibold">{option.label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {option.description}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-primary">
                          Total: {formatPrice(subtotal * (1 + option.rate))}
                        </p>
                      </button>
                    ))}
                  </div>

                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-4 text-destructive text-sm mb-4 flex items-center justify-between gap-3">
                      <span>{error}</span>
                      {paymentMethod === 'mercadopago' && (
                        <button
                          onClick={() => {
                            // re-trigger the preference effect
                            setError('');
                            setPreferenceId('');
                            setPaymentMethod('mercadopago');
                            setCurrentStep(2);
                            // force effect by toggling a no-op state
                            setFormData((p) => ({ ...p }));
                          }}
                          className="shrink-0 inline-flex items-center gap-1 underline"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Reintentar
                        </button>
                      )}
                    </div>
                  )}

                  {isWorking && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="ml-3 text-muted-foreground">
                        Procesando...
                      </span>
                    </div>
                  )}

                  {/* MercadoPago button renders here */}
                  {paymentMethod === 'mercadopago' && (
                    <div id="payment-form"></div>
                  )}

                  {/* Offline: place the order (coordinate by WhatsApp) */}
                  {paymentMethod === 'offline' && !isWorking && (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={placeOfflineOrder}
                    >
                      Confirmar pedido y coordinar por WhatsApp
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="mt-4"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
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
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {surcharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Recargo MercadoPago (20%)
                      </span>
                      <span>{formatPrice(surcharge)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-muted-foreground text-center bg-muted p-3 rounded-lg">
                  Precios en efectivo o transferencia. Con MercadoPago se
                  agrega 20% (hasta 3 cuotas). El envío se coordina por
                  WhatsApp después de la compra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
