/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Review } from '../models/Review';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ModerationService {
  /**
   * Obtener reviews pendientes de moderación
   * Obtiene una lista de reviews que requieren aprobación de moderador.
   * @param offset Cantidad de reviews a saltar
   * @param limit Cantidad máxima de reviews a retornar
   * @returns Review Lista de reviews pendientes obtenida exitosamente
   * @throws ApiError
   */
  public static moderationControllerGetPendingReviews(
    offset?: number,
    limit?: number
  ): CancelablePromise<Array<Review>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/admin/reviews/pending',
      query: {
        offset: offset,
        limit: limit,
      },
    });
  }
  /**
   * Obtener reviews reportados
   * Obtiene una lista de reviews que han sido reportados por usuarios.
   * @param offset Cantidad de reviews a saltar
   * @param limit Cantidad máxima de reviews a retornar
   * @returns Review Lista de reviews reportados obtenida exitosamente
   * @throws ApiError
   */
  public static moderationControllerGetFlaggedReviews(
    offset?: number,
    limit?: number
  ): CancelablePromise<Array<Review>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/admin/reviews/flagged',
      query: {
        offset: offset,
        limit: limit,
      },
    });
  }
  /**
   * Obtener estadísticas de moderación
   * Obtiene estadísticas generales sobre el estado de los reviews.
   * @returns any Estadísticas obtenidas exitosamente
   * @throws ApiError
   */
  public static moderationControllerGetModerationStats(): CancelablePromise<{
    pending?: number;
    approved?: number;
    rejected?: number;
    hidden?: number;
    flagged?: number;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/admin/reviews/stats',
    });
  }
  /**
   * Aprobar un review
   * Aprueba un review pendiente, haciendo que sea visible públicamente.
   * @param id ID del review a aprobar
   * @returns Review Review aprobado exitosamente
   * @throws ApiError
   */
  public static moderationControllerApproveReview(
    id: string
  ): CancelablePromise<Review> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/admin/reviews/{id}/approve',
      path: {
        id: id,
      },
      errors: {
        404: `Review no encontrado`,
      },
    });
  }
  /**
   * Rechazar un review
   * Rechaza un review, evitando que sea visible públicamente.
   * @param id ID del review a rechazar
   * @returns Review Review rechazado exitosamente
   * @throws ApiError
   */
  public static moderationControllerRejectReview(
    id: string
  ): CancelablePromise<Review> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/admin/reviews/{id}/reject',
      path: {
        id: id,
      },
      errors: {
        404: `Review no encontrado`,
      },
    });
  }
  /**
   * Ocultar un review
   * Oculta un review aprobado, removiendo su visibilidad pública.
   * @param id ID del review a ocultar
   * @returns Review Review ocultado exitosamente
   * @throws ApiError
   */
  public static moderationControllerHideReview(
    id: string
  ): CancelablePromise<Review> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/admin/reviews/{id}/hide',
      path: {
        id: id,
      },
      errors: {
        404: `Review no encontrado`,
      },
    });
  }
  /**
   * Aprobar múltiples reviews
   * Aprueba múltiples reviews pendientes en una sola operación.
   * @returns Review Reviews aprobados exitosamente
   * @throws ApiError
   */
  public static moderationControllerBulkApprove(): CancelablePromise<
    Array<Review>
  > {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/admin/reviews/bulk/approve',
    });
  }
  /**
   * Rechazar múltiples reviews
   * Rechaza múltiples reviews en una sola operación.
   * @returns Review Reviews rechazados exitosamente
   * @throws ApiError
   */
  public static moderationControllerBulkReject(): CancelablePromise<
    Array<Review>
  > {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/admin/reviews/bulk/reject',
    });
  }
}
