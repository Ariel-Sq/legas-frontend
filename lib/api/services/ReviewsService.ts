/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateReviewDto } from '../models/CreateReviewDto';
import type { Review } from '../models/Review';
import type { UpdateReviewDto } from '../models/UpdateReviewDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReviewsService {
  /**
   * Crear un nuevo review
   * Crea un nuevo review para un producto. Requiere autenticación por provider externo.
   * @param requestBody
   * @returns Review Review creado exitosamente
   * @throws ApiError
   */
  public static reviewsControllerCreate(
    requestBody: CreateReviewDto
  ): CancelablePromise<Review> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/reviews',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Datos inválidos o usuario ya reviewó este producto`,
        401: `Usuario no autenticado`,
        404: `Producto no encontrado`,
      },
    });
  }
  /**
   * Obtener reviews de un producto
   * Obtiene una lista paginada de reviews para un producto específico.
   * @param productVariationId ID de la variación del producto
   * @param page Número de página (empezando desde 1)
   * @param limit Cantidad de resultados por página
   * @param productId ID del producto para filtrar reviews
   * @param verifiedOnly Filtrar solo reviews verificadas (compras reales)
   * @param minRating Calificación mínima (1-5 estrellas)
   * @param status Estado del review
   * @param sortBy Ordenar por campo
   * @param sortOrder Orden ascendente o descendente
   * @param search Buscar texto en título y contenido
   * @returns any Lista de reviews obtenida exitosamente
   * @throws ApiError
   */
  public static reviewsControllerFindByProductVariationId(
    productVariationId: string,
    page?: number,
    limit?: number,
    productId?: string,
    verifiedOnly?: boolean,
    minRating?: number,
    status?: 'pending' | 'approved' | 'rejected' | 'hidden' | 'flagged',
    sortBy?: 'createdAt' | 'rating' | 'helpfulVotes',
    sortOrder?: 'asc' | 'desc',
    search?: string
  ): CancelablePromise<{
    reviews?: Array<Review>;
    total?: number;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/reviews/product/{productVariationId}',
      path: {
        productVariationId: productVariationId,
      },
      query: {
        page: page,
        limit: limit,
        productId: productId,
        verifiedOnly: verifiedOnly,
        minRating: minRating,
        status: status,
        sortBy: sortBy,
        sortOrder: sortOrder,
        search: search,
      },
    });
  }
  /**
   * Obtener un review por ID
   * Obtiene un review específico por su ID.
   * @param id ID del review
   * @returns Review Review encontrado
   * @throws ApiError
   */
  public static reviewsControllerFindById(
    id: string
  ): CancelablePromise<Review> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/reviews/{id}',
      path: {
        id: id,
      },
      errors: {
        404: `Review no encontrado`,
      },
    });
  }
  /**
   * Actualizar un review
   * Actualiza un review existente. Requiere autenticación por provider externo.
   * @param id ID del review a actualizar
   * @param requestBody
   * @returns Review Review actualizado exitosamente
   * @throws ApiError
   */
  public static reviewsControllerUpdate(
    id: string,
    requestBody: UpdateReviewDto
  ): CancelablePromise<Review> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/reviews/{id}',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        401: `Usuario no autenticado`,
        403: `No tienes permisos para editar este review`,
        404: `Review no encontrado`,
      },
    });
  }
  /**
   * Eliminar un review
   * Elimina un review existente. Requiere autenticación por provider externo.
   * @param id ID del review a eliminar
   * @returns void
   * @throws ApiError
   */
  public static reviewsControllerRemove(id: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/reviews/{id}',
      path: {
        id: id,
      },
      errors: {
        401: `Usuario no autenticado`,
        403: `No tienes permisos para eliminar este review`,
        404: `Review no encontrado`,
      },
    });
  }
  /**
   * Marcar review como útil
   * Marca un review como útil. Requiere autenticación por provider externo.
   * @param id ID del review
   * @returns any Review marcado como útil
   * @throws ApiError
   */
  public static reviewsControllerMarkAsHelpful(
    id: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/reviews/{id}/helpful',
      path: {
        id: id,
      },
      errors: {
        401: `Usuario no autenticado`,
      },
    });
  }
  /**
   * Reportar un review
   * Reporta un review inapropiado. Requiere autenticación por provider externo.
   * @param id ID del review a reportar
   * @returns any Review reportado exitosamente
   * @throws ApiError
   */
  public static reviewsControllerReportReview(
    id: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/reviews/{id}/report',
      path: {
        id: id,
      },
      errors: {
        401: `Usuario no autenticado`,
      },
    });
  }
}
