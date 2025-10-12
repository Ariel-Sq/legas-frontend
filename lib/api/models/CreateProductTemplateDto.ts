/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateProductTemplateDto = {
  /**
   * Template name
   */
  name: string;
  /**
   * URL-friendly identifier for the template
   */
  slug: string;
  /**
   * Template description
   */
  description?: string;
  /**
   * Default specifications for products using this template
   */
  specifications?: Record<string, any>;
  /**
   * Category IDs this template belongs to (can be multiple)
   */
  category_ids?: Array<string>;
  /**
   * Whether the template is active
   */
  is_active?: boolean;
};
