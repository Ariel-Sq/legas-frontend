'use client';

import type React from 'react';

import { useCart } from '@/components/cart-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  createCheckoutPreference,
  type CheckoutPaymentMethod,
} from '@/lib/checkout';
import { formatPrice, formatPriceDecimal } from '@/lib/utils';
import {
  INSTALLMENT_COUNT,
  TRANSFER_DISCOUNT_RATE,
  installmentAmount,
  transferPrice,
} from '@/lib/pricing';
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

const WHATSAPP_NUMBER = '5491173666370';

/**
 * How the shopper pays. Catalogue prices are the list price:
 *  - MercadoPago charges the list price, split into 6 interest-free
 *    installments.
 *  - Transfer/cash gets a discount.
 * Keep these rates in sync with the backend
 * (ecommerce-backend/src/payments/payment-method.config.ts) and lib/pricing.ts.
 */
const PAYMENT_OPTIONS: {
  key: CheckoutPaymentMethod;
  label: string;
  description: string;
}[] = [
  {
    key: 'mercadopago',
    label: 'MercadoPago',
    description: `Tarjeta, débito o dinero en cuenta. Hasta ${INSTALLMENT_COUNT} cuotas sin interés.`,
  },
  {
    key: 'offline',
    label: 'Transferencia o efectivo',
    description: `${Math.round(TRANSFER_DISCOUNT_RATE * 100)}% de descuento. Coordinamos por WhatsApp.`,
  },
];

export function CheckoutClient() {
  const { items, subtotal, loading, clearCart } = useCart();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>('mercadopago');
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState('');
  // Set once an offline order is placed → success screen with WhatsApp CTA.
  const [offlineOrderId, setOfflineOrderId] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    dni: '',
    address: '',
  });
  // true → el comprador retira en persona y no hace falta dirección.
  const [pickupInPerson, setPickupInPerson] = useState(false);

  // Pre-fill contact from the logged-in user (session is merged with the
  // backend user in lib/auth.ts). Only fills empty fields, so the shopper can
  // still override anything.
  useEffect(() => {
    const u = session?.user;
    if (!u) return;
    const profileAddress = [u.address, u.city, u.state, u.zipCode, u.country]
      .filter(Boolean)
      .join(', ');
    setFormData((prev) => ({
      email: prev.email || u.email || '',
      phone: prev.phone || u.phoneNumber || '',
      dni: prev.dni || u.dni || '',
      address: prev.address || profileAddress,
    }));
  }, [session]);

  // Transfer/cash pays the discounted price; MercadoPago pays the list price.
  const isTransfer = paymentMethod === 'offline';
  const transferDiscount = isTransfer ? subtotal * TRANSFER_DISCOUNT_RATE : 0;
  const total = subtotal - transferDiscount;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const phoneValid = formData.phone.trim().length >= 6;
  // DNI argentino: 7 u 8 dígitos, sin puntos.
  const dniDigits = formData.dni.replace(/\D/g, '');
  const dniValid = /^\d{7,8}$/.test(dniDigits);
  // Con retiro en persona no pedimos dirección; si es envío, es obligatoria.
  const addressValid = pickupInPerson || formData.address.trim().length >= 8;
  const canContinueToPayment =
    emailValid && phoneValid && dniValid && addressValid;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinueToPayment) return;
    setCurrentStep(2);
  };

  // Deterministic idempotency key for the current cart + method: a re-click
  // (or retry) reuses the live order/preference instead of creating another.
  // The key changes when the cart or the payment method changes.
  const checkoutSignature = `${items
    .map((i) => `${i.id}:${i.quantity}`)
    .sort()
    .join(',')}|${paymentMethod}`;
  const idempotencyKey = useMemo(() => {
    // Small djb2 hash → stable key without a hashing lib.
    let h = 5381;
    for (let i = 0; i < checkoutSignature.length; i++) {
      h = (h * 33) ^ checkoutSignature.charCodeAt(i);
    }
    return `co-${(h >>> 0).toString(36)}`;
  }, [checkoutSignature]);

  // Guards double clicks / concurrent calls.
  const submittingRef = useRef(false);

  const payWithMercadoPago = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsWorking(true);
    setError('');
    const result = await createCheckoutPreference(
      userId,
      {
        customerEmail: formData.email.trim(),
        customerPhone: formData.phone.trim(),
        customerDni: dniDigits,
        deliveryMethod: pickupInPerson ? 'pickup' : 'delivery',
        deliveryAddress: pickupInPerson ? '' : formData.address.trim(),
      },
      'mercadopago',
      idempotencyKey
    );
    if (result.error || !result.checkoutUrl) {
      setError(result.error || 'No pudimos iniciar el pago.');
      setIsWorking(false);
      submittingRef.current = false;
      return;
    }
    // Order + preference created (once); go straight to MercadoPago.
    window.location.href = result.checkoutUrl;
  };

  const placeOfflineOrder = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsWorking(true);
    setError('');
    const result = await createCheckoutPreference(
      userId,
      {
        customerEmail: formData.email.trim(),
        customerPhone: formData.phone.trim(),
        customerDni: dniDigits,
        deliveryMethod: pickupInPerson ? 'pickup' : 'delivery',
        deliveryAddress: pickupInPerson ? '' : formData.address.trim(),
      },
      'offline'
    );
    if (result.error || !result.orderId) {
      setError(result.error || 'No pudimos registrar el pedido.');
      submittingRef.current = false;
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
                      Con tu email y teléfono coordinamos el pago por WhatsApp.
                      Dejanos la dirección de entrega, o marcá que retirás en
                      persona.
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
                    <div>
                      <Label htmlFor="dni">
                        DNI <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="dni"
                        type="text"
                        inputMode="numeric"
                        placeholder="30123456"
                        value={formData.dni}
                        onChange={handleInputChange}
                        required
                        aria-invalid={!dniValid && formData.dni.length > 0}
                      />
                      {!dniValid && formData.dni.length > 0 && (
                        <p className="mt-1 text-xs text-destructive">
                          Ingresá un DNI válido (7 u 8 dígitos, sin puntos).
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="pickup"
                        checked={pickupInPerson}
                        onCheckedChange={(v) => setPickupInPerson(v === true)}
                      />
                      <Label htmlFor="pickup" className="cursor-pointer">
                        Retiro en persona (no necesito envío)
                      </Label>
                    </div>
                    {!pickupInPerson && (
                      <div>
                        <Label htmlFor="address">
                          Dirección de entrega{' '}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="Calle y altura, piso/depto, localidad y provincia"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          aria-invalid={
                            !addressValid && formData.address.length > 0
                          }
                        />
                        {!addressValid && formData.address.length > 0 && (
                          <p className="mt-1 text-xs text-destructive">
                            Ingresá una dirección completa para el envío.
                          </p>
                        )}
                      </div>
                    )}
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
                        {option.key === 'offline' ? (
                          <p className="mt-2 text-sm font-semibold text-primary">
                            {formatPriceDecimal(transferPrice(subtotal))} con
                            transferencia
                          </p>
                        ) : (
                          <p className="mt-2 text-sm font-semibold text-primary">
                            En {INSTALLMENT_COUNT} cuotas sin interés de{' '}
                            {formatPriceDecimal(installmentAmount(subtotal))}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>

                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-4 text-destructive text-sm mb-4 flex items-center justify-between gap-3">
                      <span>{error}</span>
                      <button
                        onClick={
                          paymentMethod === 'mercadopago'
                            ? payWithMercadoPago
                            : placeOfflineOrder
                        }
                        className="shrink-0 inline-flex items-center gap-1 underline"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Reintentar
                      </button>
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

                  {/* MercadoPago: explicit button — creates the order once and
                      redirects to Checkout Pro (no auto-create, no SDK). */}
                  {paymentMethod === 'mercadopago' && !isWorking && (
                    <Button
                      size="lg"
                      className="w-full bg-[#009EE3] text-white hover:bg-[#008FCC]"
                      onClick={payWithMercadoPago}
                    >
                      Pagar con MercadoPago
                    </Button>
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
                <h2 className="mb-4 text-xl font-semibold">
                  Resumen del pedido
                </h2>

                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          fill
                          sizes="64px"
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
                  {isTransfer ? (
                    <div className="flex justify-between text-sm text-primary">
                      <span>
                        Descuento transferencia (
                        {Math.round(TRANSFER_DISCOUNT_RATE * 100)}%)
                      </span>
                      <span>-{formatPrice(transferDiscount)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{INSTALLMENT_COUNT} cuotas sin interés de</span>
                      <span>
                        {formatPriceDecimal(installmentAmount(subtotal))}
                      </span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-muted-foreground text-center bg-muted p-3 rounded-lg">
                  Con MercadoPago pagás en {INSTALLMENT_COUNT} cuotas sin
                  interés. Por transferencia o efectivo tenés{' '}
                  {Math.round(TRANSFER_DISCOUNT_RATE * 100)}% de descuento. El
                  envío se coordina por WhatsApp después de la compra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
