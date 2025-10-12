/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCategoryDto = {
  /**
   * Category name
   */
  name: string;
  /**
   * URL-friendly identifier for the category
   */
  slug: string;
  /**
   * Category description
   */
  description?: string;
  /**
   * Parent category ID for nested categories
   */
  parentId?: string;
  /**
   * Category image URL
   */
  image?: string;
  /**
   * Category icon identifier
   */
  icon?: string;
  /**
   * Whether the category is active
   */
  is_active?: boolean;
  /**
   * Sort order for category display
   */
  sort_order?: number;
  /**
   * Category nesting level
   */
  level?: number;
  /**
   * Meta title for SEO
   */
  meta_title?: string;
  /**
   * Meta description for SEO
   */
  meta_description?: string;
};
