/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateProductDto } from '../models/UpdateProductDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductsService {
  /**
   * @returns any
   * @throws ApiError
   */
  public static productsControllerFindAllWithDetails(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/products/with-details',
    });
  }
  /**
   * Get the main image of a product
   * @param id
   * @returns any
   * @throws ApiError
   */
  public static productsControllerGetProductVariationImage(
    id: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/products/{id}/image',
      path: {
        id: id,
      },
    });
  }
  /**
   * Create a new product with multiple images
   * Creates a new product with the ability to upload multiple images.
   * @param formData
   * @returns any
   * @throws ApiError
   */
  public static productsControllerCreate(formData: {
    sku: string;
    name: string;
    price: number;
    /**
     * Product attributes as key-value pairs
     */
    attributes?: Record<string, any>;
    inStock?: boolean;
    /**
     * Product template ID to associate with this product
     */
    template_id?: string;
    /**
     * ProductVariation images (select multiple files)
     */
    files?: Array<Blob>;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/products',
      formData: formData,
      mediaType: 'multipart/form-data',
    });
  }
  /**
   * Update a product with optional new images
   * @param id
   * @param formData Product data with optional file uploads
   * @returns any
   * @throws ApiError
   */
  public static productsControllerUpdate(
    id: string,
    formData: UpdateProductDto
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/products/{id}',
      path: {
        id: id,
      },
      formData: formData,
      mediaType: 'multipart/form-data',
    });
  }
  /**
   * Update product data (JSON only)
   * @param id
   * @param requestBody Product data to update
   * @returns any
   * @throws ApiError
   */
  public static productsControllerUpdateJson(
    id: string,
    requestBody: UpdateProductDto
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/products/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id
   * @returns any
   * @throws ApiError
   */
  public static productsControllerDelete(id: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/products/{id}',
      path: {
        id: id,
      },
    });
  }
}
