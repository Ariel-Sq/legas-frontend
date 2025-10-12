/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WebhookNotificationDto } from '../models/WebhookNotificationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentsService {
  /**
   * Create a Mercado Pago checkout preference from cart
   * Creates a checkout preference using items from the current cart. Requires authentication and a non-empty cart with sufficient stock.
   * @returns any The checkout preference has been successfully created
   * @throws ApiError
   */
  public static paymentsControllerCreateCheckout(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/payments/mercadopago/checkout',
      errors: {
        400: `Cart is empty or insufficient stock for one or more items`,
        401: `User must be authenticated to create checkout`,
      },
    });
  }
  /**
   * Handle Mercado Pago webhook notifications
   * @param requestBody
   * @returns any The webhook notification has been successfully processed
   * @throws ApiError
   */
  public static paymentsControllerHandleWebhook(
    requestBody: WebhookNotificationDto
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/payments/mercadopago/webhook',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
