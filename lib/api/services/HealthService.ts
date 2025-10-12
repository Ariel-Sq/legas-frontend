/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthService {
  /**
   * Health check
   * Checks the health status of the application and its dependencies
   * @returns any Application is healthy
   * @throws ApiError
   */
  public static healthControllerCheck(): CancelablePromise<{
    status?: string;
    version?: string;
    checks?: Record<string, any>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/health',
      errors: {
        503: `The Health Check is not successful`,
      },
    });
  }
}
