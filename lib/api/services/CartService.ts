/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddToCartDto } from '../models/AddToCartDto';
import type { Cart } from '../models/Cart';
import type { UpdateCartItemDto } from '../models/UpdateCartItemDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CartService {
  /**
   * Get current cart
   * @returns Cart Cart found
   * @throws ApiError
   */
  public static cartControllerGetCart(): CancelablePromise<Cart> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/cart',
    });
  }
  /**
   * Add product to cart
   * @param requestBody
   * @returns Cart Product added successfully
   * @throws ApiError
   */
  public static cartControllerAddToCart(
    requestBody: AddToCartDto
  ): CancelablePromise<Cart> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/cart/items',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Update product quantity in cart
   * @param id Cart item ID
   * @param requestBody
   * @returns Cart Cart updated
   * @throws ApiError
   */
  public static cartControllerUpdateCartItem(
    id: string,
    requestBody: UpdateCartItemDto
  ): CancelablePromise<Cart> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/cart/items/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Remove product from cart
   * @param id Cart item ID
   * @returns Cart Product removed from cart
   * @throws ApiError
   */
  public static cartControllerRemoveFromCart(
    id: string
  ): CancelablePromise<Cart> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/cart/items/{id}',
      path: {
        id: id,
      },
    });
  }
  /**
   * Clear cart
   * @returns Cart Cart cleared
   * @throws ApiError
   */
  public static cartControllerClearCart(): CancelablePromise<Cart> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/cart/clear',
    });
  }
}
