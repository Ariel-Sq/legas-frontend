/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductVariation } from './ProductVariation';
export type ProductRatingSummary = {
  /**
   * Unique identifier for the rating summary
   */
  id: string;
  /**
   * ID of the product variation
   */
  productVariationId: string;
  /**
   * Product variation this summary belongs to
   */
  productVariation?: ProductVariation;
  /**
   * Average rating across all reviews
   */
  averageRating: number;
  /**
   * Total number of reviews
   */
  totalReviews: number;
  /**
   * Distribution of ratings by star count
   */
  ratingDistribution: Record<string, any>;
  /**
   * Number of verified reviews (from verified purchases)
   */
  verifiedReviews: number;
  /**
   * Average rating from verified reviews only
   */
  verifiedAverageRating: number;
  /**
   * When this summary was last calculated
   */
  lastCalculated: string;
  /**
   * Date when the summary was created
   */
  createdAt: string;
  /**
   * Date when the summary was last updated
   */
  updatedAt: string;
};
