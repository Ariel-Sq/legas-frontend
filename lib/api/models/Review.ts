/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Order } from './Order';
import type { ProductVariation } from './ProductVariation';
import type { ReviewImage } from './ReviewImage';
import type { User } from './User';
export type Review = {
  /**
   * Unique identifier for the review
   */
  id: string;
  /**
   * ID of the user who wrote the review
   */
  userId: string;
  /**
   * User who wrote the review
   */
  user?: User;
  /**
   * ID of the product variation being reviewed
   */
  productVariationId: string;
  /**
   * Product variation being reviewed
   */
  productVariation?: ProductVariation;
  /**
   * ID of the order associated with this review
   */
  orderId?: string;
  /**
   * Order associated with this review
   */
  order?: Order;
  /**
   * Title of the review
   */
  title: string;
  /**
   * Content of the review
   */
  content: string;
  /**
   * Rating given by the user (1-5)
   */
  rating: number;
  /**
   * Whether this review is from a verified purchase
   */
  isVerifiedPurchase: boolean;
  /**
   * Current status of the review
   */
  status: Review.status;
  /**
   * Number of helpful votes this review has received
   */
  helpfulVotes: number;
  /**
   * Number of times this review has been reported
   */
  reportCount: number;
  /**
   * Reason for moderation action
   */
  moderationReason?: string;
  /**
   * ID of the moderator who took action
   */
  moderatedBy?: string;
  /**
   * Images attached to this review
   */
  images?: Array<ReviewImage>;
  /**
   * Date when the review was created
   */
  createdAt: string;
  /**
   * Date when the review was last updated
   */
  updatedAt: string;
};
export namespace Review {
  /**
   * Current status of the review
   */
  export enum status {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    HIDDEN = 'hidden',
    FLAGGED = 'flagged',
  }
}
