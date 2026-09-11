'use server';

import { BACKEND_URL } from '@/utils/environments';
import { getAuthHeaders } from './server-auth';

export interface Review {
  id: string;
  productVariationId: string;
  productTemplateId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'hidden' | 'flagged';
  helpfulCount: number;
  votedByMe: boolean;
  images: ReviewImage[];
  createdAt: string;
  updatedAt: string;
}

interface BackendReview {
  id: string;
  userId: string | null;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  } | null;
  /** Name snapshot kept after the reviewer's account is deleted. */
  authorName?: string | null;
  productVariationId: string;
  productVariation?: {
    id: string;
    template_id: string;
  } | null;
  rating: number;
  title: string;
  content: string;
  isVerifiedPurchase: boolean;
  status: Review['status'];
  helpfulVotes?: number | null;
  votedByMe?: boolean;
  images?: ReviewImage[];
  createdAt: string;
  updatedAt: string;
}

function mapReview(r: BackendReview): Review {
  const fullName = [r.user?.firstName, r.user?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
  return {
    id: r.id,
    productVariationId: r.productVariationId,
    productTemplateId: r.productVariation?.template_id ?? '',
    userId: r.userId ?? '',
    userName: fullName || r.authorName || r.user?.email || 'Anonymous',
    rating: r.rating,
    title: r.title,
    comment: r.content,
    isVerifiedPurchase: r.isVerifiedPurchase,
    status: r.status,
    helpfulCount: r.helpfulVotes ?? 0,
    votedByMe: r.votedByMe ?? false,
    images: r.images ?? [],
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export interface ReviewImage {
  id: string;
  reviewId: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  createdAt: string;
}

export interface ProductRatingSummary {
  productTemplateId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewFormData {
  productVariationId: string;
  productTemplateId: string;
  rating: number;
  title: string;
  comment: string;
  images?: File[];
}

// Get approved reviews for a template (aggregates across its variations).
// When viewerUserId is provided, the backend annotates each review with
// votedByMe so the UI can toggle the helpful button without an extra call.
export async function getProductReviews(
  productTemplateId: string,
  _viewerUserId?: string
): Promise<Review[]> {
  try {
    // Auth is optional here: when present the backend annotates votedByMe.
    const headers = await getAuthHeaders();
    const resp = await fetch(`${BACKEND_URL}/api/reviews`, {
      cache: 'no-store',
      headers,
    });
    if (!resp.ok) return [];
    const data: BackendReview[] = await resp.json();
    return data
      .filter(
        (r) =>
          r.productVariation?.template_id === productTemplateId &&
          r.status === 'approved'
      )
      .map(mapReview)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  } catch {
    return [];
  }
}

// Compute the rating summary at the template level from its approved reviews.
// The backend exposes a per-variation summary endpoint, but for the product
// detail page we want an aggregate across every variation of the template.
export async function getProductRatingSummary(
  productTemplateId: string
): Promise<ProductRatingSummary | null> {
  const reviews = await getProductReviews(productTemplateId);
  if (reviews.length === 0) return null;

  const distribution: ProductRatingSummary['ratingDistribution'] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  let sum = 0;
  for (const r of reviews) {
    sum += r.rating;
    const bucket = Math.max(1, Math.min(5, Math.round(r.rating))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    distribution[bucket] += 1;
  }
  return {
    productTemplateId,
    averageRating: sum / reviews.length,
    totalReviews: reviews.length,
    ratingDistribution: distribution,
  };
}

// Returns the set of productVariationIds the current user has already
// reviewed. Used to swap the "Dejar reseña" CTA for an "Ya reseñado" pill.
export async function getMyReviewedVariationIds(
  _userId?: string
): Promise<Set<string>> {
  try {
    const resp = await fetch(`${BACKEND_URL}/api/reviews/mine`, {
      cache: 'no-store',
      headers: await getAuthHeaders(),
    });
    if (!resp.ok) return new Set();
    const data: BackendReview[] = await resp.json();
    return new Set(data.map((r) => r.productVariationId));
  } catch {
    return new Set();
  }
}

// Submit a new review. Requires authentication on the backend; identity is
// resolved server-side from the session and sent as a Bearer token.
export async function submitReview(
  _userId: string,
  reviewData: ReviewFormData
): Promise<Review> {
  const resp = await fetch(`${BACKEND_URL}/api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify({
      productVariationId: reviewData.productVariationId,
      rating: reviewData.rating,
      title: reviewData.title,
      content: reviewData.comment,
    }),
    cache: 'no-store',
  });
  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`Failed to submit review (${resp.status}): ${detail}`);
  }
  return mapReview(await resp.json());
}

// Mark a review as helpful. Requires authentication. 409 is tolerated
// (user already voted) so the call is safe to repeat optimistically.
export async function markReviewHelpful(
  reviewId: string,
  _userId?: string
): Promise<void> {
  const resp = await fetch(`${BACKEND_URL}/api/reviews/${reviewId}/helpful`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  });
  if (!resp.ok && resp.status !== 409) {
    throw new Error(`Failed to mark helpful (${resp.status})`);
  }
}

// Remove the current user's helpful vote on a review. Idempotent.
export async function unmarkReviewHelpful(
  reviewId: string,
  _userId?: string
): Promise<void> {
  const resp = await fetch(`${BACKEND_URL}/api/reviews/${reviewId}/helpful`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  });
  if (!resp.ok && resp.status !== 204) {
    throw new Error(`Failed to remove helpful vote (${resp.status})`);
  }
}
