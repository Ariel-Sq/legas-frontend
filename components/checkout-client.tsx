'use client';

import type React from 'react';

import { useCart } from '@/components/cart-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  createCardIntent,
  createCheckoutPreference,
  type CheckoutPaymentOption,
} from '@/lib/checkout';
import { CardPaymentForm } from '@/components/card-payment-form';
import { formatPrice, formatPriceDecimal } from '@/lib/utils';
import {
  INSTALLMENT_COUNT,
  LIST_PRICE_MARKUP,
  pickupDeposit,
} from '@/lib/pricing';
import { ARGENTINIAN_PROVINCES } from '@/lib/provinces';
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  CreditCard,
  Lock,
  MapPin,
  CheckCircle,
  Package,
  Loader2,
  MessageCircle,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';


/**
 * How the shopper pays. Catalogue prices are the list price:
 *  - MercadoPago charges the list price, split into 6 interest-free
 *    installments.
 *  - Transfer/cash gets a discount.
 * Keep these rates in sync with the backend
 * (ecommerce-backend/src/payments/payment-method.config.ts) and lib/pricing.ts.
 */
const PAYMENT_OPTIONS: {
  key: CheckoutPaymentOption;
  /** Compact label for the selector. */
  short: string;
  label: string;
  description: string;
  icon: typeof CreditCard;
}[] = [
  {
    key: 'card',
    short: 'Tarjeta',
    label: 'Tarjeta de crédito o débito',
    description:
      'Completás los datos acá mismo, sin salir del sitio. Hasta 12 cuotas.',
    icon: CreditCard,
  },
  {
    key: 'mercadopago',
    short: 'MercadoPago',
    label: 'MercadoPago',
    description:
      'Pagás con tu saldo en cuenta o con cuotas sin tarjeta. Te llevamos a MercadoPago y volvés.',
    icon: Wallet,
  },
  {
    key: 'offline',
    short: 'Efectivo',
    label: 'Transferencia o efectivo',
    description:
      'Precio de contado. Coordinamos el pago por WhatsApp al confirmar el pedido.',
    icon: Banknote,
  },
];


/**
 * A server action whose function was killed can leave its promise pending
 * forever, which used to freeze the button on "Procesando". Cap the wait and
 * let the shopper retry: the backend is idempotent, so a retry reuses the
 * order/preference already created.
 */
function withDeadline<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('checkout-timeout')),
      ms
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export interface CheckoutSettings {
  /** Payment methods enabled in the panel. */
  enabledPayments?: {
    mercadopago: boolean;
    offline: boolean;
    /** On-site card form. Missing = enabled (older settings predate it). */
    card?: boolean;
  };
  shipping?: { cost: number; freeFrom: number; notes: string };
}

export function CheckoutClient({ settings }: { settings?: CheckoutSettings } = {}) {
  const { items, subtotal, loading, clearCart } = useCart();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [currentStep, setCurrentStep] = useState(1);
  // Only the methods the panel leaves enabled are offered. `card` is new:
  // settings saved before it existed have no key, so treat missing as enabled.
  const paymentOptions = PAYMENT_OPTIONS.filter((option) => {
    if (!settings?.enabledPayments) return true;
    if (option.key === 'card') return settings.enabledPayments.card !== false;
    return settings.enabledPayments[option.key];
  });
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentOption>(
    paymentOptions[0]?.key ?? 'card'
  );
  const selectedOption =
    paymentOptions.find((option) => option.key === paymentMethod) ??
    paymentOptions[0];
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState('');
  // Set once an offline order is placed → success screen with WhatsApp CTA.
  // Snapshot taken when the order is placed: the backend clears the cart, so
  // the totals derived from it become 0 and cannot feed the success screen.
  const [offlineOrder, setOfflineOrder] = useState<{
    orderId: string;
    isPickupDeposit: boolean;
    total: number;
    deposit: number;
    balance: number;
  } | null>(null);

  // Set once the card intent is created → the card form (Brick) is rendered.
  const [cardOrder, setCardOrder] = useState<{
    orderId: string;
    amount: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    dni: '',
    street: '',
    streetNumber: '',
    apartment: '',
    locality: '',
    zipCode: '',
    province: '',
    reference: '',
  });
  // true → el comprador retira en persona y no hace falta dirección.
  const [pickupInPerson, setPickupInPerson] = useState(false);

  // Pre-fill contact from the logged-in user (session is merged with the
  // backend user in lib/auth.ts). Only fills empty fields, so the shopper can
  // still override anything.
  useEffect(() => {
    const u = session?.user;
    if (!u) return;
    setFormData((prev) => ({
      ...prev,
      email: prev.email || u.email || '',
      phone: prev.phone || u.phoneNumber || '',
      dni: prev.dni || u.dni || '',
      street: prev.street || u.address || '',
      locality: prev.locality || u.city || '',
      province: prev.province || u.state || '',
      zipCode: prev.zipCode || u.zipCode || '',
    }));
  }, [session]);

  // Structured form → one readable address string for the order (shipping and
  // the WhatsApp hand-off both read this text, so it must stay complete).
  const deliveryAddress = [
    [formData.street.trim(), formData.streetNumber.trim()]
      .filter(Boolean)
      .join(' ') +
      (formData.apartment.trim() ? `, ${formData.apartment.trim()}` : ''),
    [formData.locality.trim(), formData.province.trim()]
      .filter(Boolean)
      .join(', ') +
      (formData.zipCode.trim() ? ` (CP ${formData.zipCode.trim()})` : ''),
    formData.reference.trim()
      ? `Entre calles / referencia: ${formData.reference.trim()}`
      : '',
  ]
    .filter((line) => line.trim().length > 0)
    .join('\n');

  // Two prices: cash/transfer pays the catalogue price, card pays the card
  // price (catalogue + markup). Framed as two prices, never as a card
  // surcharge — charging extra for card use is prohibited (Ley 25.065).
  const isTransfer = paymentMethod === 'offline';
  // Card price per item: undo the cash-only promo that is already inside the
  // stored price, add the card markup, then apply the MercadoPago-only promo.
  // Matches what the backend charges in `createCheckoutPreferenceFromCart`.
  const cardSubtotal = items.reduce((sum, item) => {
    const offline = item.offlinePercent ?? 0;
    const mp = item.mpPercent ?? 0;
    const base = offline > 0 ? item.price / (1 - offline / 100) : item.price;
    return sum + base * (1 + LIST_PRICE_MARKUP) * (1 - mp / 100) * item.quantity;
  }, 0);
  const total = isTransfer ? subtotal : cardSubtotal;
  const hasCardPromo = items.some((item) => (item.mpPercent ?? 0) > 0);

  // Pickup + cash/transfer: 50% deposit by transfer to reserve the piece, the
  // rest is paid when the shopper picks it up. Exact half, no rounding.
  const isPickupDeposit = pickupInPerson && isTransfer;
  const deposit = isPickupDeposit ? pickupDeposit(total) : 0;
  const balance = isPickupDeposit ? total - deposit : 0;

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
  // CPA (B1614) or plain 4-digit postal code, both accepted.
  const zipCodeValid = /^[A-Za-z]?\d{4}[A-Za-z]{0,3}$/.test(
    formData.zipCode.trim()
  );
  // Con retiro en persona no pedimos dirección; si es envío, es obligatoria.
  const addressValid =
    pickupInPerson ||
    (formData.street.trim().length >= 3 &&
      formData.streetNumber.trim().length > 0 &&
      formData.locality.trim().length >= 3 &&
      zipCodeValid &&
      formData.province.trim().length > 0);
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
    let result;
    try {
      result = await withDeadline(
        createCheckoutPreference(
          userId,
          {
            customerEmail: formData.email.trim(),
            customerPhone: formData.phone.trim(),
            customerDni: dniDigits,
            deliveryMethod: pickupInPerson ? 'pickup' : 'delivery',
            deliveryAddress: pickupInPerson ? '' : deliveryAddress,
          },
          'mercadopago',
          idempotencyKey
        ),
        20000
      );
    } catch {
      setError(
        'El pago está tardando más de lo normal. Si el pedido ya se creó va a figurar en Mis pedidos; probá de nuevo en unos segundos.'
      );
      setIsWorking(false);
      submittingRef.current = false;
      return;
    }
    if (result.error || !result.checkoutUrl) {
      setError(result.error || 'No pudimos iniciar el pago.');
      setIsWorking(false);
      submittingRef.current = false;
      return;
    }
    // Order + preference created (once); go straight to MercadoPago.
    window.location.href = result.checkoutUrl;
  };

  /**
   * On-site card payment: create the order hold, then render the card form.
   * The Brick charges exactly the amount the backend returned.
   */
  const startCardPayment = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsWorking(true);
    setError('');
    let result;
    try {
      result = await withDeadline(
        createCardIntent(
          {
            customerEmail: formData.email.trim(),
            customerPhone: formData.phone.trim(),
            customerDni: dniDigits,
            deliveryMethod: pickupInPerson ? 'pickup' : 'delivery',
            deliveryAddress: pickupInPerson ? '' : deliveryAddress,
          },
          idempotencyKey
        ),
        20000
      );
    } catch {
      setError(
        'El pago está tardando más de lo normal. Probá de nuevo en unos segundos.'
      );
      setIsWorking(false);
      submittingRef.current = false;
      return;
    }
    if (result.error || !result.orderId || !result.amount) {
      setError(result.error || 'No pudimos preparar el pago con tarjeta.');
      setIsWorking(false);
      submittingRef.current = false;
      return;
    }
    setCardOrder({ orderId: result.orderId, amount: result.amount });
    setIsWorking(false);
    submittingRef.current = false;
  };

  const placeOfflineOrder = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsWorking(true);
    setError('');
    // Snapshot before the request: placing the order empties the cart.
    const amounts = {
      isPickupDeposit,
      total,
      deposit,
      balance,
    };
    let result;
    try {
      result = await withDeadline(
        createCheckoutPreference(
          userId,
          {
            customerEmail: formData.email.trim(),
            customerPhone: formData.phone.trim(),
            customerDni: dniDigits,
            deliveryMethod: pickupInPerson ? 'pickup' : 'delivery',
            deliveryAddress: pickupInPerson ? '' : deliveryAddress,
          },
          'offline'
        ),
        20000
      );
    } catch {
      setError(
        'El pedido está tardando más de lo normal. Probá de nuevo en unos segundos.'
      );
      setIsWorking(false);
      submittingRef.current = false;
      return;
    }
    if (result.error || !result.orderId) {
      setError(result.error || 'No pudimos registrar el pedido.');
      submittingRef.current = false;
    } else {
      // Backend already cleared the cart; sync the client badge.
      setOfflineOrder({ orderId: result.orderId, ...amounts });
      clearCart();
    }
    setIsWorking(false);
  };

  /** Success page polls the order status, so a pending payment lands there too. */
  const goToSuccess = useCallback((orderId: string) => {
    window.location.href = `/checkout/success?external_reference=${encodeURIComponent(
      orderId
    )}`;
  }, []);

  /**
   * A declined card cancels the order on the backend, so the intent is dead:
   * discard it and show the reason with a retry that creates a new one.
   */
  const handleCardRejected = useCallback((message: string) => {
    setCardOrder(null);
    setError(message);
  }, []);

  // ----- Offline success screen -----
  if (offlineOrder) {
    const shortId = offlineOrder.orderId.slice(0, 8).toUpperCase();
    const waText = encodeURIComponent(
      offlineOrder.isPickupDeposit
        ? `Hola Legas! Hice el pedido ${shortId} para retirar en persona y pagar en efectivo/transferencia. La seña del 50% es ${formatPrice(offlineOrder.deposit)} (la abono dentro de las 48 hs) y el saldo al retirar ${formatPrice(offlineOrder.balance)}. ¿Me pasás los datos para transferir?`
        : `Hola Legas! Acabo de hacer el pedido ${shortId} para pagar por transferencia/efectivo. ¿Cómo coordinamos?`
    );
    return (
      <main className="flex-grow">
        <div className="container mx-auto max-w-lg px-4 py-16 text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="mb-2 text-3xl font-bold">¡Pedido registrado!</h1>
          <p className="mb-1 text-muted-foreground">
            Tu número de pedido es <strong>{shortId}</strong>.
          </p>
          {offlineOrder.isPickupDeposit ? (
            <p className="mb-8 text-muted-foreground">
              Te reservamos los productos. Para confirmar el pedido transferí la
              seña de <strong>{formatPrice(offlineOrder.deposit)}</strong> (50%);
              el saldo de{' '}
              <strong>{formatPrice(offlineOrder.balance)}</strong> lo pagás al retirar.
              La seña se abona dentro de las 48 horas: escribinos por WhatsApp
              y te pasamos los datos para transferir.
            </p>
          ) : (
            <p className="mb-8 text-muted-foreground">
              Te reservamos los productos. Escribinos por WhatsApp y coordinamos
              el pago (transferencia o efectivo) y la entrega.
            </p>
          )}
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
                    Datos de entrega
                  </h2>
                  <form onSubmit={handleShippingSubmit} className="grid gap-4">
                    <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                      Con tu email y teléfono coordinamos el envío. Si pagás en
                      efectivo o por transferencia, también coordinamos el
                      pago. Completá la dirección de entrega, o marcá que
                      retirás en persona.
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
                      <div className="space-y-4 rounded-lg border p-4">
                        <p className="text-sm font-medium">
                          Dirección de entrega
                        </p>
                        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                          <div>
                            <Label htmlFor="street">
                              Calle <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="street"
                              placeholder="Juan de Herrera"
                              value={formData.street}
                              onChange={handleInputChange}
                              autoComplete="address-line1"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="streetNumber">
                              Número <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="streetNumber"
                              placeholder="2651"
                              value={formData.streetNumber}
                              onChange={handleInputChange}
                              autoComplete="address-line2"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="apartment">Depto / piso</Label>
                            <Input
                              id="apartment"
                              placeholder="3º B (opcional)"
                              value={formData.apartment}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="locality">
                              Localidad{' '}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="locality"
                              placeholder="Villa de Mayo"
                              value={formData.locality}
                              onChange={handleInputChange}
                              autoComplete="address-level2"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="zipCode">
                              Código postal{' '}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="zipCode"
                              placeholder="B1614"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              autoComplete="postal-code"
                              required
                              aria-invalid={
                                !zipCodeValid && formData.zipCode.length > 0
                              }
                            />
                            {!zipCodeValid && formData.zipCode.length > 0 && (
                              <p className="mt-1 text-xs text-destructive">
                                Ingresá un código postal válido (4 dígitos,
                                ej. 1614 o B1614).
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="province">
                              Provincia{' '}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={formData.province}
                              onValueChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  province: value,
                                }))
                              }
                            >
                              <SelectTrigger
                                id="province"
                                className="w-full cursor-pointer"
                              >
                                <SelectValue placeholder="Elegí la provincia" />
                              </SelectTrigger>
                              <SelectContent>
                                {ARGENTINIAN_PROVINCES.map((province) => (
                                  <SelectItem key={province} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="reference">
                            Entre calles / referencia
                          </Label>
                          <Input
                            id="reference"
                            placeholder="Entre San Martín y Belgrano, portón verde"
                            value={formData.reference}
                            onChange={handleInputChange}
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            Nos ayuda a encontrar el domicilio el día de la
                            entrega.
                          </p>
                        </div>
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

                  <div className="mb-6 rounded-lg bg-muted/50 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">Entrega</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-primary underline cursor-pointer"
                      >
                        Editar
                      </button>
                    </div>
                    {pickupInPerson ? (
                      <p className="mt-1 text-muted-foreground">
                        Retiro en persona
                      </p>
                    ) : (
                      <p className="mt-1 whitespace-pre-line text-muted-foreground">
                        {deliveryAddress}
                      </p>
                    )}
                  </div>

                  {/* Selector compacto: tres medios, una sola fila */}
                  <div className="mb-4">
                    <p className="mb-2 text-sm font-medium">
                      ¿Cómo querés pagar?
                    </p>
                    <div
                      role="radiogroup"
                      aria-label="Medio de pago"
                      className="grid grid-cols-3 gap-2"
                    >
                      {paymentOptions.map((option) => {
                        const Icon = option.icon;
                        const active = paymentMethod === option.key;
                        return (
                          <button
                            key={option.key}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => {
                              setPaymentMethod(option.key);
                              setError('');
                            }}
                            className={`flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border px-1 py-2 text-center transition-colors ${
                              active
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border text-muted-foreground hover:bg-muted/50'
                            }`}
                          >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                            <span className="text-xs font-medium leading-tight">
                              {option.short}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detalle del medio elegido */}
                  <div className="mb-4 rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold">{selectedOption?.label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {selectedOption?.description}
                        </p>
                      </div>
                      <p className="whitespace-nowrap font-semibold text-primary">
                        {formatPriceDecimal(
                          paymentMethod === 'offline' ? subtotal : cardSubtotal
                        )}
                      </p>
                    </div>

                    {paymentMethod === 'card' && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        3 cuotas sin interés con Visa, Mastercard y Naranja.
                        Amex no tiene cuotas sin interés.
                      </p>
                    )}

                    {isPickupDeposit && (
                      <div className="mt-3 border-t pt-3 text-sm">
                        <p className="font-semibold">
                          Seña del 50% para reservar el pedido
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Abonás{' '}
                          <strong>{formatPriceDecimal(deposit)}</strong> por
                          transferencia para reservar la pieza. Los{' '}
                          <strong>{formatPriceDecimal(balance)}</strong>{' '}
                          restantes los pagás al retirar. Al confirmar te
                          enviamos los datos por WhatsApp; la seña se abona{' '}
                          <strong>dentro de las 48 horas</strong>.
                        </p>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-4 text-destructive text-sm mb-4 flex items-center justify-between gap-3">
                      <span>{error}</span>
                      <button
                        onClick={
                          paymentMethod === 'mercadopago'
                            ? payWithMercadoPago
                            : paymentMethod === 'card'
                              ? startCardPayment
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

                  {/* Tarjeta en el sitio: crea la orden y muestra el Brick */}
                  {paymentMethod === 'card' && !isWorking && !cardOrder && (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={startCardPayment}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Continuar al pago con tarjeta
                    </Button>
                  )}

                  {/* Tarjeta: formulario tokenizado de MercadoPago + 3DS */}
                  {paymentMethod === 'card' && cardOrder && (
                    <div className="rounded-lg border bg-card p-4">
                      <p className="mb-3 text-sm text-muted-foreground">
                        Total a pagar:{' '}
                        <strong className="text-foreground">
                          {formatPriceDecimal(cardOrder.amount)}
                        </strong>
                      </p>
                      <CardPaymentForm
                        orderId={cardOrder.orderId}
                        amount={cardOrder.amount}
                        email={formData.email.trim()}
                        dni={dniDigits}
                        maxInstallments={INSTALLMENT_COUNT}
                        onApproved={goToSuccess}
                        onPending={goToSuccess}
                        onRejected={handleCardRejected}
                      />
                      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>
                          Los datos de la tarjeta los procesa MercadoPago. No
                          los guardamos ni los vemos en ningún momento.
                        </span>
                      </p>
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
                      <span>Precio en efectivo o transferencia</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm text-primary">
                        <span>Precio con tarjeta hasta 12 cuotas</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                      {hasCardPromo && (
                        <p className="text-xs text-muted-foreground">
                          Incluye el descuento vigente para MercadoPago.
                        </p>
                      )}
                    </>
                  )}
                  {isPickupDeposit && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Seña a transferir (50%)
                        </span>
                        <span className="font-semibold">
                          {formatPrice(deposit)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Saldo al retirar
                        </span>
                        <span className="font-semibold">
                          {formatPrice(balance)}
                        </span>
                      </div>
                    </>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {settings?.shipping &&
                  (settings.shipping.cost > 0 ||
                    settings.shipping.freeFrom > 0 ||
                    settings.shipping.notes) && (
                    <div className="mt-3 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">Envío</p>
                      {settings.shipping.freeFrom > 0 && (
                        <p>
                          Sin cargo desde{' '}
                          {formatPrice(settings.shipping.freeFrom)}.
                        </p>
                      )}
                      {settings.shipping.cost > 0 && (
                        <p>
                          AMBA: {formatPrice(settings.shipping.cost)} (se
                          coordina al confirmar).
                        </p>
                      )}
                      {settings.shipping.notes && (
                        <p className="mt-1">{settings.shipping.notes}</p>
                      )}
                    </div>
                  )}

                <p className="mt-4 text-xs text-muted-foreground text-center bg-muted p-3 rounded-lg">
                  Los productos tienen dos precios: en efectivo o transferencia,
                  y con tarjeta hasta 12 cuotas. Las 3 cuotas sin interés
                  aplican a Visa, Mastercard y Naranja; Amex no tiene cuotas sin
                  interés. El envío no está incluido en el total: se cotiza
                  según la zona antes del despacho. Si no aceptás el costo del
                  envío, podés cancelar la compra sin cargo y te reintegramos el
                  total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
