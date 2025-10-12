/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDto } from '../models/CreateUserDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
  /**
   * Get all users
   * @returns User Return all users
   * @throws ApiError
   */
  public static usersControllerFindAll(): CancelablePromise<Array<User>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/users',
    });
  }
  /**
   * Create a new user
   * @param requestBody
   * @returns User The user has been successfully created.
   * @throws ApiError
   */
  public static usersControllerCreate(
    requestBody: CreateUserDto
  ): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/users',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request.`,
        409: `User already exists.`,
      },
    });
  }
  /**
   * Get a user by email
   * @param email
   * @returns User Return a user by email
   * @throws ApiError
   */
  public static usersControllerFindOne(email: string): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/users/{email}',
      path: {
        email: email,
      },
      errors: {
        404: `User not found.`,
      },
    });
  }
  /**
   * Update a user
   * @param id
   * @param requestBody
   * @returns User The user has been successfully updated.
   * @throws ApiError
   */
  public static usersControllerUpdate(
    id: string,
    requestBody: UpdateUserDto
  ): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/users/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `User not found.`,
      },
    });
  }
  /**
   * Delete a user
   * @param id
   * @returns void
   * @throws ApiError
   */
  public static usersControllerRemove(id: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/users/{id}',
      path: {
        id: id,
      },
      errors: {
        404: `User not found.`,
      },
    });
  }
}
