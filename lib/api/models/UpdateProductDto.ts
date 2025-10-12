/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateProductDto = {
  /**
   * Product SKU (Stock Keeping Unit) - must be unique
   */
  sku?: string;
  /**
   * Product name
   */
  name?: string;
  /**
   * Product price
   */
  price?: number;
  /**
   * Product attributes as key-value pairs
   */
  attributes?: Record<string, any>;
  /**
   * Whether product is in stock
   */
  inStock?: boolean;
  /**
   * Product template ID to associate with this product
   */
  template_id?: string;
  /**
   * Whether to replace existing images with new ones when uploading files
   */
  replaceImages?: boolean;
};
