'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  STATUS_COLOR,
  STATUS_LABEL,
  getStatusIcon,
  type Order,
} from '@/lib/orders-shared';
import { submitReview } from '@/lib/reviews';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SignInPromptDialog } from '@/components/sign-in-prompt-dialog';
import { CheckCircle2, Package, RefreshCw, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface OrdersClientProps {
  initialOrders: Order[];
  isAuthenticated?: boolean;
  userId?: string;
  reviewedVariationIds?: string[];
}

type OrderItem = Order['items'][number];

export function OrdersClient({
  initialOrders,
  isAuthenticated = false,
  userId,
  reviewedVariationIds = [],
}: OrdersClientProps) {
  const router = useRouter();
  // Use the server-provided prop directly (not a snapshot in useState) so a
  // router.refresh() actually updates the list.
  const orders = initialOrders;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [locallyReviewed, setLocallyReviewed] = useState<Set<string>>(
    new Set(reviewedVariationIds)
  );
  const [reviewItem, setReviewItem] = useState<OrderItem | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const refresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Order statuses change asynchronously (MercadoPago webhook), and the
  // shopper may return to this tab after paying. Refresh on focus and every
  // 15s so the list (and statuses) stay current.
  useEffect(() => {
    const onFocus = () => router.refresh();
    const onVisible = () => {
      if (document.visibilityState === 'visible') router.refresh();
    };
    const interval = setInterval(() => router.refresh(), 15000);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [router]);

  const resetReviewForm = () => {
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setComment('');
    setFormError(null);
    setIsSubmitting(false);
  };

  const handleReviewClick = (item: OrderItem) => {
    if (!userId) {
      setShowSignInPrompt(true);
      return;
    }
    resetReviewForm();
    setReviewItem(item);
  };

  const handleReviewDialogOpenChange = (open: boolean) => {
    if (!open) {
      setReviewItem(null);
      resetReviewForm();
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !reviewItem) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      await submitReview(userId, {
        productVariationId: reviewItem.productVariationId,
        productTemplateId: reviewItem.productVariationId,
        rating,
        title,
        comment,
      });
      setLocallyReviewed((prev) => {
        const next = new Set(prev);
        next.add(reviewItem.productVariationId);
        return next;
      });
      setReviewItem(null);
      resetReviewForm();
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (
        message.includes('409') ||
        message.toLowerCase().includes('already reviewed')
      ) {
        setFormError('Ya dejaste una reseña para este producto.');
      } else {
        setFormError('No pudimos guardar tu reseña, probá de nuevo.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SignInPromptDialog
        open={showSignInPrompt}
        onOpenChange={setShowSignInPrompt}
        title="Iniciá sesión para opinar"
        description="Compartí tu experiencia con la comunidad. Solo necesitamos un email para identificarte."
      />

      <Dialog
        open={reviewItem !== null}
        onOpenChange={handleReviewDialogOpenChange}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dejar una reseña</DialogTitle>
            <DialogDescription>
              {reviewItem
                ? `Contanos qué te pareció ${reviewItem.name}.`
                : 'Contanos qué te pareció el producto.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <Label>Calificación *</Label>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none cursor-pointer"
                    aria-label={`${star} estrellas`}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="review-title">Título *</Label>
              <Input
                id="review-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Resumí tu experiencia"
                required
              />
            </div>

            <div>
              <Label htmlFor="review-comment">Comentario *</Label>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Contanos más sobre tu experiencia con este producto"
                rows={4}
                required
              />
            </div>

            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleReviewDialogOpenChange(false)}
                className="cursor-pointer"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="cursor-pointer"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Mis pedidos
              </h1>
              <p className="text-muted-foreground">
                Mirá y seguí el historial de tus compras
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={isRefreshing}
              className="cursor-pointer shrink-0"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Actualizar
            </Button>
          </div>

          {!isAuthenticated && (
            <Card className="mb-6 border-primary/40 bg-primary/5">
              <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Estás viendo solo los pedidos hechos con este navegador.
                  Iniciá sesión para verlos siempre, incluso si cambiás de
                  dispositivo.
                </p>
                <Button asChild size="sm" className="cursor-pointer">
                  <Link href="/api/auth/signin">Iniciar sesión</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Todavía no hay pedidos
                </h3>
                <p className="text-muted-foreground mb-6">
                  Empezá a comprar y los vas a ver acá
                </p>
                <Button asChild className="cursor-pointer">
                  <Link href="/shop">Ir a la tienda</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block rounded-lg transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Card className="cursor-pointer">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            Pedido #{order.orderNumber}
                            <Badge
                              variant="outline"
                              className={STATUS_COLOR[order.status]}
                            >
                              <span className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {STATUS_LABEL[order.status]}
                              </span>
                            </Badge>
                          </CardTitle>
                          <CardDescription>
Realizado el{' '}
                             {new Date(order.date).toLocaleDateString('es-AR', {
                               year: 'numeric',
                               month: 'long',
                               day: 'numeric',
                               hour: '2-digit',
                               minute: '2-digit',
                             })}
                          </CardDescription>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-2xl font-bold text-primary">
                            {formatPrice(order.total)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}{' '}
                            productos
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div className="grid gap-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border">
                                <Image
                                  src={item.image || '/placeholder.svg'}
                                  alt={item.name}
                                  fill
                                  sizes="80px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Cantidad: {item.quantity}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="text-right">
                                  <p className="font-semibold">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatPrice(item.price)} c/u
                                  </p>
                                </div>
                                {order.status === 'paid_delivered' &&
                                  (locallyReviewed.has(
                                    item.productVariationId
                                  ) ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                      Ya reseñaste
                                    </span>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="cursor-pointer gap-1 shadow-sm hover:shadow"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleReviewClick(item);
                                      }}
                                    >
                                      <Star className="h-4 w-4 fill-current" />
                                      Dejar reseña
                                    </Button>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Info */}
                        {(order.shipping.address || order.shipping.phone) && (
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">
                              Datos de entrega
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {order.shipping.address || 'Retiro en persona'}
                              {order.shipping.phone && (
                                <>
                                  <br />
                                  Tel: {order.shipping.phone}
                                </>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
