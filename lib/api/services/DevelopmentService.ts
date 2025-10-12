/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DevelopmentService {
  /**
   * Clear database and storage (development only)
   * Clears all database data and storage files. Only available in development environment.
   * @returns any Database and storage cleared successfully
   * @throws ApiError
   */
  public static developmentControllerClearDatabase(): CancelablePromise<{
    success?: boolean;
    message?: string;
    data?: Record<string, any>;
  }> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/development/clear-database',
      errors: {
        400: `Endpoint not available in production`,
      },
    });
  }
}
