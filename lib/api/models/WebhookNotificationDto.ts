/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WebhookNotificationDto = {
  /**
   * The ID of the notification
   */
  id: number;
  /**
   * Whether the notification is from live mode or test mode
   */
  live_mode: boolean;
  /**
   * The type of notification (e.g., payment, subscription, etc.)
   */
  type: string;
  /**
   * When the notification was created
   */
  date_created: string;
  /**
   * The application ID
   */
  application_id: number;
  /**
   * The user ID
   */
  user_id: number;
  /**
   * The version of the API
   */
  api_version: string;
  /**
   * The action that triggered the notification
   */
  action: string;
  /**
   * The data object containing the resource ID
   */
  data: Record<string, any>;
};
