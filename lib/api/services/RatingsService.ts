/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductRatingSummary } from '../models/ProductRatingSummary';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RatingsService {
  /**
   * Obtener resumen de calificaciones de un producto
   * Obtiene el resumen estadístico de calificaciones para un producto específico.
   * @param productVariationId ID de la variación del producto
   * @returns ProductRatingSummary Resumen de calificaciones obtenido exitosamente
   * @throws ApiError
   */
  public static ratingsControllerGetRatingSummary(
    productVariationId: string
  ): CancelablePromise<ProductRatingSummary> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ratings/product/{productVariationId}/summary',
      path: {
        productVariationId: productVariationId,
      },
      errors: {
        404: `Producto no encontrado o sin calificaciones`,
      },
    });
  }
  /**
   * Obtener distribución de calificaciones
   * Obtiene la distribución detallada de calificaciones (1-5 estrellas) para un producto.
   * @param productVariationId ID de la variación del producto
   * @returns any Distribución de calificaciones obtenida exitosamente
   * @throws ApiError
   */
  public static ratingsControllerGetRatingDistribution(
    productVariationId: string
  ): CancelablePromise<{
    distribution?: {
      /**
       * Cantidad de calificaciones de 1 estrella
       */
      '1'?: number;
      /**
       * Cantidad de calificaciones de 2 estrellas
       */
      '2'?: number;
      /**
       * Cantidad de calificaciones de 3 estrellas
       */
      '3'?: number;
      /**
       * Cantidad de calificaciones de 4 estrellas
       */
      '4'?: number;
      /**
       * Cantidad de calificaciones de 5 estrellas
       */
      '5'?: number;
    };
    totalReviews?: number;
    averageRating?: number;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ratings/product/{productVariationId}/distribution',
      path: {
        productVariationId: productVariationId,
      },
    });
  }
  /**
   * Obtener productos mejor calificados
   * Obtiene una lista de productos ordenados por calificación promedio.
   * @param minReviews Cantidad mínima de reviews requerida
   * @param limit Cantidad máxima de productos a retornar
   * @returns any Lista de productos mejor calificados obtenida exitosamente
   * @throws ApiError
   */
  public static ratingsControllerGetTopRatedProducts(
    minReviews?: number,
    limit?: number
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/ratings/top-rated',
      query: {
        minReviews: minReviews,
        limit: limit,
      },
    });
  }
}
