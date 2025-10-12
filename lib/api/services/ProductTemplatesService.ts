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
   * @returns any
   * @throws ApiError
   */
  public static productTemplatesControllerFindAll(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/product-templates',
    });
  }
  /**
   * @param requestBody
   * @returns any
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
   * @param id
   * @param requestBody
   * @returns any
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
    });
  }
  /**
   * @param id
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
    });
  }
}
