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
   * @returns any
   * @throws ApiError
   */
  public static productPriceTiersControllerFindAll(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/product-price-tiers',
    });
  }
  /**
   * @param variationId
   * @returns any
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
   * @param id
   * @returns any
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
    });
  }
  /**
   * @param id
   * @param requestBody
   * @returns any
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
    });
  }
  /**
   * @param id
   * @returns any
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
    });
  }
}
