/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StorageService {
  /**
   * @param path Directory path to list
   * @returns any
   * @throws ApiError
   */
  public static storageControllerListFiles(
    path?: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/storage/list',
      query: {
        path: path,
      },
    });
  }
  /**
   * @param path Path of the file to get URL for
   * @param expiresIn Expiration time in seconds (default: 60)
   * @returns any
   * @throws ApiError
   */
  public static storageControllerGetSignedUrl(
    path: string,
    expiresIn?: number
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/storage/url/{path}',
      path: {
        path: path,
      },
      query: {
        expiresIn: expiresIn,
      },
    });
  }
  /**
   * @param path
   * @returns any
   * @throws ApiError
   */
  public static storageControllerUploadFile(
    path: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/storage/upload',
      query: {
        path: path,
      },
    });
  }
  /**
   * @param path Path of the file to delete
   * @returns any
   * @throws ApiError
   */
  public static storageControllerDeleteFile(
    path: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/storage/files/{path}',
      path: {
        path: path,
      },
    });
  }
}
