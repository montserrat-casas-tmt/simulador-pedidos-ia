/**
 * Generate an order object from selected product suggestions
 */
export function generateOrder(customerName, selectedItems) {
    // Create order items from selected products
    const items = selectedItems.map(item => ({
        productId: item.product.id,
        quantity: item.suggestedQuantity
    }));
    
    // Calculate total order amount
    const total = selectedItems.reduce((sum, item) => {
        return sum + (item.product.price * item.suggestedQuantity);
    }, 0);
    
    // Create the order object
    const order = {
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
export function generateOrderJson(order) {
    return JSON.stringify(order, null, 2);
}

/**
 * Calculate the total price for a list of product suggestions
 */
export function calculateTotalPrice(items) {
    return items.reduce((total, item) => {
        return total + (item.product.price * item.suggestedQuantity);
    }, 0);
}

/**
 * Save order to local storage
 */
export function saveOrderToHistory(order) {
    const history = getOrderHistory();
    history.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(history));
}

/**
 * Get order history from local storage
 */
export function getOrderHistory() {
    const history = localStorage.getItem('orderHistory');
    return history ? JSON.parse(history) : [];
}