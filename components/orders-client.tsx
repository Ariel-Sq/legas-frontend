'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Order } from '@/lib/orders';
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
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  Wrench,
  PackageCheck,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface OrdersClientProps {
  initialOrders: Order[];
  isAuthenticated?: boolean;
  userId?: string;
}

type OrderItem = Order['items'][number];

export function OrdersClient({
  initialOrders,
  isAuthenticated = false,
  userId,
}: OrdersClientProps) {
  const router = useRouter();
  const [orders] = useState<Order[]>(initialOrders);
  const [reviewItem, setReviewItem] = useState<OrderItem | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'processing_payment':
        return <Clock className="h-4 w-4" />;
      case 'paid_preparing':
        return <Wrench className="h-4 w-4" />;
      case 'paid_ready_to_ship':
        return <PackageCheck className="h-4 w-4" />;
      case 'paid_shipped':
        return <Truck className="h-4 w-4" />;
      case 'paid_delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'refunded':
        return <RotateCcw className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing_payment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid_preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid_ready_to_ship':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'paid_shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'paid_delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-zinc-200 text-zinc-800 border-zinc-300';
    }
  };

  const statusLabel: Record<Order['status'], string> = {
    processing_payment: 'Procesando pago',
    paid_preparing: 'Pagado y preparando el producto',
    paid_ready_to_ship: 'Pagado y listo para enviar',
    paid_shipped: 'Pagado y en camino',
    paid_delivered: 'Pagado y entregado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
  };

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
      setReviewItem(null);
      resetReviewForm();
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('409')) {
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Mis pedidos</h1>
            <p className="text-muted-foreground">
              Mirá y seguí el historial de tus compras
            </p>
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
                <h3 className="text-xl font-semibold mb-2">Todavía no hay pedidos</h3>
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
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Pedido #{order.orderNumber}
                          <Badge
                            variant="outline"
                            className={getStatusColor(order.status)}
                          >
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {statusLabel[order.status]}
                            </span>
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Realizado el{' '}
                          {new Date(order.date).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </CardDescription>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-2xl font-bold text-primary">
                          ${order.total.toFixed(2)}
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
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  ${item.price.toFixed(2)} c/u
                                </p>
                              </div>
                              {order.status === 'paid_delivered' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="cursor-pointer gap-1"
                                  onClick={() => handleReviewClick(item)}
                                >
                                  <Star className="h-4 w-4" />
                                  Dejar reseña
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Info */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">Dirección de envío</h4>
                        <p className="text-sm text-muted-foreground">
                          {order.shipping.name}
                          <br />
                          {order.shipping.address}
                          <br />
                          {order.shipping.city}, {order.shipping.postalCode}
                          <br />
                          {order.shipping.country}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
