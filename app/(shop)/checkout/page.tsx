import { CheckoutClient } from '@/components/checkout-client';
import { getShopSettings } from '@/lib/site-settings';

export default async function CheckoutPage() {
  const settings = await getShopSettings();

  return (
    <CheckoutClient
      settings={{
        enabledPayments: {
          mercadopago: settings.payments.mercadopago,
          // Transfer and cash share one option: it stays if either is on.
          offline: settings.payments.transfer || settings.payments.cash,
        },
        shipping: settings.shipping,
      }}
    />
  );
}
