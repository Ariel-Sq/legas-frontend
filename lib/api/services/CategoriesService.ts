/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCategoryDto } from '../models/CreateCategoryDto';
import type { MoveCategoryDto } from '../models/MoveCategoryDto';
import type { UpdateCategoryDto } from '../models/UpdateCategoryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoriesService {
  /**
   * @returns any
   * @throws ApiError
   */
  public static categoriesControllerGetCategoryTree(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/categories/tree',
    });
  }
  /**
   * Create a new category
   * Creates a new category in the system
   * @param requestBody
   * @returns any Category created successfully
   * @throws ApiError
   */
  public static categoriesControllerCreate(
    requestBody: CreateCategoryDto
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/categories',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request - validation error or business logic violation`,
        404: `Parent category not found`,
      },
    });
  }
  /**
   * Move category to a new position or parent
   * Moves a category to a new parent category or changes its sort order within the same parent.
   * @param id Category ID to move
   * @param requestBody
   * @returns any Category moved successfully
   * @throws ApiError
   */
  public static categoriesControllerMoveCategory(
    id: string,
    requestBody: MoveCategoryDto
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/categories/{id}/move',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Invalid move operation (e.g., category cannot be its own parent)`,
        404: `Category not found`,
      },
    });
  }
  /**
   * Update a category
   * Updates an existing category with the provided data
   * @param id Category ID to update
   * @param requestBody
   * @returns any Category updated successfully
   * @throws ApiError
   */
  public static categoriesControllerUpdate(
    id: string,
    requestBody: UpdateCategoryDto
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/categories/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request - validation error or business logic violation`,
        404: `Category not found`,
      },
    });
  }
  /**
   * @param id
   * @returns void
   * @throws ApiError
   */
  public static categoriesControllerRemove(
    id: string
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/categories/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * @returns void
   * @throws ApiError
   */
  public static categoriesControllerDeleteAll(): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/categories/delete-all',
    });
  }
}
