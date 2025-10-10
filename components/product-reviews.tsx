'use client';

import type React from 'react';

import { useState } from 'react';
import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import type { Review, ProductRatingSummary } from '@/lib/reviews';
import { markReviewHelpful, submitReview } from '@/lib/reviews';
import { useRouter } from 'next/navigation';

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  ratingSummary: ProductRatingSummary | null;
  userId?: string;
}

export function ProductReviews({
  productId,
  reviews,
  ratingSummary,
  userId,
}: ProductReviewsProps) {
  const router = useRouter();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('Debes iniciar sesión para dejar una reseña');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview(userId, {
        productVariationId: productId,
        productTemplateId: productId,
        rating,
        title,
        comment,
      });
      setShowReviewForm(false);
      setRating(0);
      setTitle('');
      setComment('');
      router.refresh();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error al enviar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markReviewHelpful(reviewId);
      router.refresh();
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      {ratingSummary && (
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Reseñas de Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
              <div className="text-5xl font-bold mb-2">
                {ratingSummary.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(ratingSummary.averageRating)
                        ? 'fill-primary text-primary'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {ratingSummary.totalReviews} reseñas
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count =
                  ratingSummary.ratingDistribution[
                    stars as keyof typeof ratingSummary.ratingDistribution
                  ];
                const percentage =
                  ratingSummary.totalReviews > 0
                    ? (count / ratingSummary.totalReviews) * 100
                    : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm">{stars}</span>
                      <Star className="h-3 w-3 fill-primary text-primary" />
                    </div>
                    <Progress value={percentage} className="flex-1" />
                    <span className="text-sm text-muted-foreground w-8">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Write Review Button */}
          {!showReviewForm && (
            <Button onClick={() => setShowReviewForm(true)} className="mb-6">
              Escribir una Reseña
            </Button>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Escribe tu Reseña</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating Stars */}
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
                        className="focus:outline-none"
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

                {/* Title */}
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Resume tu experiencia"
                    required
                  />
                </div>

                {/* Comment */}
                <div>
                  <Label htmlFor="comment">Comentario *</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Cuéntanos más sobre tu experiencia con este producto"
                    rows={4}
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting || rating === 0}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {review.userAvatar ? (
                      <img
                        src={review.userAvatar || '/placeholder.svg'}
                        alt={review.userName}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {review.userName.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.userName}</span>
                    {review.isVerifiedPurchase && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Compra verificada
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-semibold">{review.title}</h4>

                  {/* Comment */}
                  <p className="text-muted-foreground">{review.comment}</p>

                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {review.images.map((image) => (
                        <img
                          key={image.id}
                          src={image.imageUrl || '/placeholder.svg'}
                          alt={image.altText}
                          className="h-20 w-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}

                  {/* Helpful Button */}
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkHelpful(review.id)}
                      className="gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Útil ({review.helpfulCount})
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {reviews.length === 0 && !ratingSummary && (
        <div className="text-center py-12 border-t">
          <p className="text-muted-foreground mb-4">
            Aún no hay reseñas para este producto
          </p>
          <Button onClick={() => setShowReviewForm(true)}>
            Sé el primero en opinar
          </Button>
        </div>
      )}
    </div>
  );
}
