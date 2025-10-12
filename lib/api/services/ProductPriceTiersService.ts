/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProductPriceTierDto } from '../models/CreateProductPriceTierDto';
import type { UpdateProductPriceTierDto } from '../models/UpdateProductPriceTierDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductPriceTiersService {
  /**
   * Crear un nuevo tier de precio
   * Crea un nuevo rango de precio basado en cantidad para una variación de producto
   * @param requestBody
   * @returns any Tier de precio creado exitosamente
   * @throws ApiError
   */
  public static productPriceTiersControllerCreate(
    requestBody: CreateProductPriceTierDto
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/product-price-tiers',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Get all product price tiers
   * Retrieves all product price tiers
   * @returns any Product price tiers retrieved successfully
   * @throws ApiError
   */
  public static productPriceTiersControllerFindAll(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/product-price-tiers',
    });
  }
  /**
   * Get price tiers by product variation
   * Retrieves all price tiers for a specific product variation
   * @param variationId Product variation ID
   * @returns any Price tiers retrieved successfully
   * @throws ApiError
   */
  public static productPriceTiersControllerFindByVariation(
    variationId: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/product-price-tiers/by-variation/{variationId}',
      path: {
        variationId: variationId,
      },
    });
  }
  /**
   * Obtener precio para cantidad específica
   * Calcula el precio unitario basado en la cantidad solicitada usando los tiers configurados
   * @param variationId UUID de la variación de producto
   * @param quantity Cantidad de productos para calcular el precio
   * @returns any Precio calculado exitosamente
   * @throws ApiError
   */
  public static productPriceTiersControllerGetPriceForQuantity(
    variationId: string,
    quantity: number
  ): CancelablePromise<{
    price?: number;
    quantity?: number;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/product-price-tiers/price/{variationId}',
      path: {
        variationId: variationId,
      },
      query: {
        quantity: quantity,
      },
    });
  }
  /**
   * Get a product price tier by ID
   * Retrieves a specific product price tier
   * @param id Product price tier ID
   * @returns any Product price tier retrieved successfully
   * @throws ApiError
   */
  public static productPriceTiersControllerFindOne(
    id: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/product-price-tiers/{id}',
      path: {
        id: id,
      },
      errors: {
        404: `Product price tier not found`,
      },
    });
  }
  /**
   * Update a product price tier
   * Updates an existing product price tier
   * @param id Product price tier ID
   * @param requestBody
   * @returns any Product price tier updated successfully
   * @throws ApiError
   */
  public static productPriceTiersControllerUpdate(
    id: string,
    requestBody: UpdateProductPriceTierDto
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/product-price-tiers/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `Product price tier not found`,
      },
    });
  }
  /**
   * Delete a product price tier
   * Removes a product price tier
   * @param id Product price tier ID
   * @returns any Product price tier deleted successfully
   * @throws ApiError
   */
  public static productPriceTiersControllerRemove(
    id: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/product-price-tiers/{id}',
      path: {
        id: id,
      },
      errors: {
        404: `Product price tier not found`,
      },
    });
  }
}
