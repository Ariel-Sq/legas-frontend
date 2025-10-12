/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProductTemplateDto } from '../models/CreateProductTemplateDto';
import type { UpdateProductTemplateDto } from '../models/UpdateProductTemplateDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductTemplatesService {
  /**
   * Get all product templates
   * Retrieves all product templates
   * @returns any Product templates retrieved successfully
   * @throws ApiError
   */
  public static productTemplatesControllerFindAll(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/product-templates',
    });
  }
  /**
   * Create a product template
   * Creates a new product template
   * @param requestBody
   * @returns any Product template created successfully
   * @throws ApiError
   */
  public static productTemplatesControllerCreate(
    requestBody: CreateProductTemplateDto
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/product-templates',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Update a product template
   * Updates an existing product template
   * @param id Product template ID
   * @param requestBody
   * @returns any Product template updated successfully
   * @throws ApiError
   */
  public static productTemplatesControllerUpdate(
    id: string,
    requestBody: UpdateProductTemplateDto
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/product-templates/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `Product template not found`,
      },
    });
  }
  /**
   * Delete a product template
   * Removes a product template
   * @param id Product template ID
   * @returns void
   * @throws ApiError
   */
  public static productTemplatesControllerRemove(
    id: string
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/product-templates/{id}',
      path: {
        id: id,
      },
      errors: {
        404: `Product template not found`,
      },
    });
  }
}
