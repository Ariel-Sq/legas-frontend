/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductImagesService {
  /**
   * Get all images for a product variation
   * @param variationId ID of the product variation
   * @returns any
   * @throws ApiError
   */
  public static productImagesControllerFindAll(
    variationId: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/product-variations/{variationId}/images',
      path: {
        variationId: variationId,
      },
    });
  }
  /**
   * Upload multiple images for a product variation
   * @param variationId ID of the product variation
   * @param formData
   * @returns any
   * @throws ApiError
   */
  public static productImagesControllerUploadImages(
    variationId: string,
    formData: {
      files?: Array<Blob>;
      /**
       * Set as main product image
       */
      isMain?: boolean;
      /**
       * Alternative text for the images
       */
      altText?: string;
    }
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/product-variations/{variationId}/images',
      path: {
        variationId: variationId,
      },
      formData: formData,
      mediaType: 'multipart/form-data',
    });
  }
  /**
   * Get the image file
   * @param id ID of the image
   * @param variationId ID of the product variation
   * @returns any
   * @throws ApiError
   */
  public static productImagesControllerGetImageFile(
    id: string,
    variationId: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/product-variations/{variationId}/images/{id}/file',
      path: {
        id: id,
        variationId: variationId,
      },
    });
  }
  /**
   * Delete a product image
   * @param id ID of the image
   * @param variationId ID of the product variation
   * @returns any
   * @throws ApiError
   */
  public static productImagesControllerDeleteImage(
    id: string,
    variationId: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/product-variations/{variationId}/images/{id}',
      path: {
        id: id,
        variationId: variationId,
      },
    });
  }
}
