/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateProductPriceTierDto = {
  /**
   * UUID de la variación de producto
   */
  variation_id: string;
  /**
   * Cantidad mínima para aplicar este precio
   */
  min_quantity: number;
  /**
   * Cantidad máxima para aplicar este precio (null = sin límite)
   */
  max_quantity?: number;
  /**
   * Precio unitario para este rango de cantidad
   */
  price: number;
  /**
   * Indica si este tier de precio está activo
   */
  is_active?: boolean;
  /**
   * Orden de prioridad para tiers con cantidades similares
   */
  sort_order?: number;
};
