import { INITIAL_ORDERS, OrderRecord } from "./mockData";

// Global in-memory cache for orders during dev/runtime
// Persists orders across API calls in the Node process
const globalOrders: OrderRecord[] = [...INITIAL_ORDERS];

export function getAllOrders(): OrderRecord[] {
  return globalOrders;
}

export function getOrderByNumber(orderNumber: string): OrderRecord | undefined {
  return globalOrders.find((o) => o.orderNumber === orderNumber);
}

export function saveOrder(order: OrderRecord): OrderRecord {
  const existingIdx = globalOrders.findIndex((o) => o.orderNumber === order.orderNumber);
  if (existingIdx >= 0) {
    globalOrders[existingIdx] = order;
  } else {
    globalOrders.unshift(order);
  }
  return order;
}

export function updateOrderStatus(
  orderNumber: string,
  updates: Partial<OrderRecord>
): OrderRecord | null {
  const order = getOrderByNumber(orderNumber);
  if (!order) return null;
  Object.assign(order, updates);
  return order;
}

