/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Review } from './Review';
export type ReviewImage = {
  /**
   * Unique identifier for the review image
   */
  id: string;
  /**
   * ID of the review this image belongs to
   */
  reviewId: string;
  /**
   * Review this image belongs to
   */
  review: Review;
  /**
   * URL of the image
   */
  imageUrl: string;
  /**
   * Sort order for displaying images
   */
  sortOrder: number;
  /**
   * Date when the image was uploaded
   */
  createdAt: string;
};
