import {
  CheckCircle,
  Clock,
  PackageCheck,
  RotateCcw,
  Truck,
  Wrench,
  XCircle,
} from 'lucide-react';
import { createElement, type ReactElement } from 'react';

export type OrderStatus =
  | 'processing_payment'
  | 'pending_transfer'
  | 'paid_preparing'
  | 'paid_ready_to_ship'
  | 'paid_shipped'
  | 'paid_delivered'
  | 'cancelled'
  | 'expired'
  | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: {
    id: string;
    productVariationId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    method: 'standard' | 'express';
    cost: number;
  };
  subtotal: number;
  shippingCost: number;
  total: number;
}

export interface BackendImage {
  url?: string;
  path?: string;
}

export interface BackendOrderItem {
  id: string;
  productVariationId: string;
  title: string;
  quantity: number;
  unitPrice: string | number;
  productVariation?: {
    images?: BackendImage[];
  } | null;
}

export interface BackendOrder {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  status: string;
  totalAmount: string | number;
  createdAt: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  deliveryMethod?: string | null;
  deliveryAddress?: string | null;
  items: BackendOrderItem[];
}

export const KNOWN_STATUSES: OrderStatus[] = [
  'processing_payment',
  'pending_transfer',
  'paid_preparing',
  'paid_ready_to_ship',
  'paid_shipped',
  'paid_delivered',
  'cancelled',
  'expired',
  'refunded',
];

export const statusFromBackend = (s: string): OrderStatus =>
  (KNOWN_STATUSES as string[]).includes(s)
    ? (s as OrderStatus)
    : 'processing_payment';

export function mapOrder(o: BackendOrder): Order {
  const items = (o.items || []).map((it) => {
    const img =
      it.productVariation?.images?.find?.((i) => (i as any).isMain) ||
      it.productVariation?.images?.[0];
    return {
      id: it.id,
      productVariationId: it.productVariationId,
      name: it.title,
      price: Number(it.unitPrice),
      quantity: it.quantity,
      image: img?.url || '',
    };
  });
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = Number(o.totalAmount ?? subtotal);
  return {
    id: o.id,
    orderNumber: o.id.slice(0, 8).toUpperCase(),
    date: o.createdAt,
    status: statusFromBackend(o.status),
    items,
    shipping: {
      name: '',
      email: o.customerEmail ?? '',
      address: o.deliveryAddress ?? '',
      city: '',
      postalCode: '',
      country: '',
      phone: o.customerPhone ?? '',
      method: 'standard',
      cost: 0,
    },
    subtotal,
    shippingCost: 0,
    total,
  };
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  processing_payment: 'Procesando pago',
  pending_transfer: 'Pendiente de transferencia',
  paid_preparing: 'Pagado y preparando el producto',
  paid_ready_to_ship: 'Pagado y listo para enviar',
  paid_shipped: 'Pagado y en camino',
  paid_delivered: 'Pagado y entregado',
  cancelled: 'Cancelado',
  expired: 'Expirado',
  refunded: 'Reembolsado',
};

export const STATUS_COLOR: Record<OrderStatus, string> = {
  processing_payment: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  pending_transfer: 'bg-amber-100 text-amber-800 border-amber-200',
  paid_preparing: 'bg-blue-100 text-blue-800 border-blue-200',
  paid_ready_to_ship: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  paid_shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  paid_delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  expired: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  refunded: 'bg-zinc-200 text-zinc-800 border-zinc-300',
};

export function getStatusIcon(status: OrderStatus): ReactElement {
  const iconProps = { className: 'h-4 w-4' };
  switch (status) {
    case 'processing_payment':
      return createElement(Clock, iconProps);
    case 'pending_transfer':
      return createElement(Clock, iconProps);
    case 'paid_preparing':
      return createElement(Wrench, iconProps);
    case 'paid_ready_to_ship':
      return createElement(PackageCheck, iconProps);
    case 'paid_shipped':
      return createElement(Truck, iconProps);
    case 'paid_delivered':
      return createElement(CheckCircle, iconProps);
    case 'cancelled':
      return createElement(XCircle, iconProps);
    case 'expired':
      return createElement(XCircle, iconProps);
    case 'refunded':
      return createElement(RotateCcw, iconProps);
  }
}
