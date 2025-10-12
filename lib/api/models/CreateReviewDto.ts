/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateReviewDto = {
  /**
   * ID de la variación del producto a revisar
   */
  productVariationId: string;
  /**
   * Título del review
   */
  title: string;
  /**
   * Contenido detallado del review
   */
  content: string;
  /**
   * Calificación del producto (1-5 estrellas)
   */
  rating: number;
  /**
   * URLs de imágenes del producto recibido (máximo 5)
   */
  images?: Array<string>;
};
