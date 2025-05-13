import { Order, OrderItem, ProductSuggestion } from '../types';
import { getProductById } from '../data/products';

/**
 * Generate an order object from selected product suggestions
 */
export function generateOrder(
  customerName: string,
  selectedItems: ProductSuggestion[]
): Order {
  // Create order items from selected products
  const items: OrderItem[] = selectedItems.map(item => ({
    productId: item.product.id,
    quantity: item.suggestedQuantity
  }));
  
  // Calculate total order amount
  const total = selectedItems.reduce((sum, item) => {
    return sum + (item.product.price * item.suggestedQuantity);
  }, 0);
  
  // Create the order object
  const order: Order = {
    id: `ORD-${Date.now()}`,
    customer: customerName,
    date: new Date().toISOString(),
    items: items,
    total: parseFloat(total.toFixed(2))
  };
  
  return order;
}

/**
 * Convert the order to JSON format suitable for ERP integration
 */
export function generateOrderJson(order: Order): string {
  return JSON.stringify(order, null, 2);
}

/**
 * Calculate the total price for a list of product suggestions
 */
export function calculateTotalPrice(items: ProductSuggestion[]): number {
  return items.reduce((total, item) => {
    return total + (item.product.price * item.suggestedQuantity);
  }, 0);
}

/**
 * Save order to local storage
 */
export function saveOrderToHistory(order: Order): void {
  const history = getOrderHistory();
  history.push(order);
  localStorage.setItem('orderHistory', JSON.stringify(history));
}

/**
 * Get order history from local storage
 */
export function getOrderHistory(): Order[] {
  const history = localStorage.getItem('orderHistory');
  return history ? JSON.parse(history) : [];
}