/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StorageService {
  /**
   * List files in storage
   * Lists files and directories in the specified path
   * @param path Directory path to list
   * @returns any Files listed successfully
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
   * Get signed URL for file
   * Generates a signed URL for accessing a file
   * @param path Path of the file to get URL for
   * @param expiresIn Expiration time in seconds (default: 60)
   * @returns any Signed URL generated successfully
   * @throws ApiError
   */
  public static storageControllerGetSignedUrl(
    path: string,
    expiresIn?: number
  ): CancelablePromise<{
    /**
     * The signed URL
     */
    url?: string;
  }> {
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
   * Upload a file
   * Uploads a file to storage
   * @param path Target path for the uploaded file
   * @returns any File uploaded successfully
   * @throws ApiError
   */
  public static storageControllerUploadFile(
    path?: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/storage/upload',
      query: {
        path: path,
      },
      errors: {
        400: `No file uploaded`,
      },
    });
  }
  /**
   * Delete a file
   * Deletes a file from storage
   * @param path Path of the file to delete
   * @returns any File deleted successfully
   * @throws ApiError
   */
  public static storageControllerDeleteFile(path: string): CancelablePromise<{
    message?: string;
  }> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/storage/files/{path}',
      path: {
        path: path,
      },
    });
  }
}
