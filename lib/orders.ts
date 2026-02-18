export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: {
    id: string;
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

// Generate a random order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `WL${timestamp}${random}`;
}

// Create a new order
export async function createOrder(
  orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>
): Promise<Order> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const order: Order = {
    id: Math.random().toString(36).substr(2, 9),
    orderNumber: generateOrderNumber(),
    date: new Date().toISOString(),
    status: 'pending',
    ...orderData,
  };

  // Store in localStorage
  if (typeof window !== 'undefined') {
    const orders = getOrdersFromStorage();
    orders.unshift(order);
    localStorage.setItem('woodland_orders', JSON.stringify(orders));
  }

  return order;
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (typeof window !== 'undefined') {
    const orders = getOrdersFromStorage();
    return orders.find((order) => order.id === orderId) || null;
  }

  return null;
}

// Get all orders for current user
export async function getUserOrders(): Promise<Order[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (typeof window !== 'undefined') {
    return getOrdersFromStorage();
  }

  return [];
}

// Helper to get orders from localStorage
function getOrdersFromStorage(): Order[] {
  if (typeof window === 'undefined') return [];

  try {
    const ordersJson = localStorage.getItem('woodland_orders');
    return ordersJson ? JSON.parse(ordersJson) : [];
  } catch {
    return [];
  }
}
