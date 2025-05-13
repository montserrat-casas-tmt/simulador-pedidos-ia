import { products, ProductCategory } from './data/products.js';
import { interpretRequirement } from './utils/languageProcessor.js';
import { generateOrder, generateOrderJson } from './utils/orderGenerator.js';

// Main application state
let state = {
    customerName: '',
    input: '',
    suggestions: [],
    isLoading: false,
    showOrderConfirmation: false,
    currentOrder: null
};

// Render the entire application
function render() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="min-h-screen bg-gray-50">
            ${renderHeader()}
            <main class="container mx-auto px-4 py-6">
                ${renderInputForm()}
                ${renderProducts()}
                ${state.showOrderConfirmation ? renderOrderConfirmation() : ''}
            </main>
        </div>
    `;
    attachEventListeners();
}

// Event handling functions
function handleRequirementSubmit(requirement) {
    state.input = requirement;
    state.isLoading = true;
    render();
    
    // Simulate AI processing time
    setTimeout(() => {
        state.suggestions = interpretRequirement(requirement);
        state.isLoading = false;
        render();
    }, 1500);
}

function handleQuantityChange(id, quantity) {
    state.suggestions = state.suggestions.map(item => 
        item.product.id === id 
            ? { ...item, suggestedQuantity: quantity } 
            : item
    );
    render();
}

function handleToggleSelect(id) {
    state.suggestions = state.suggestions.map(item => 
        item.product.id === id 
            ? { ...item, selected: !item.selected } 
            : item
    );
    render();
}

function handlePlaceOrder() {
    const selectedItems = state.suggestions.filter(item => item.selected);
    if (selectedItems.length === 0) return;
    
    const order = generateOrder(state.customerName || 'Guest Customer', selectedItems);
    state.currentOrder = order;
    state.showOrderConfirmation = true;
    render();
}

function handleNewOrder() {
    state.showOrderConfirmation = false;
    state.suggestions = [];
    state.input = '';
    render();
}

// Component render functions
function renderHeader() {
    return `
        <header class="bg-[#0F52BA] text-white shadow-md">
            <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
                <div class="flex items-center mb-4 md:mb-0">
                    <svg class="w-8 h-8 mr-2 text-[#FF6B35]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    <h1 class="text-2xl font-bold">ElectriOrder</h1>
                </div>
                <div class="w-full md:w-auto">
                    <div class="flex flex-col md:flex-row items-start md:items-center">
                        <label for="customerName" class="mr-2 mb-1 md:mb-0">Customer:</label>
                        <input
                            type="text"
                            id="customerName"
                            value="${state.customerName}"
                            placeholder="Enter customer name"
                            class="px-3 py-1 rounded text-gray-800 w-full md:w-64"
                        />
                    </div>
                </div>
            </div>
        </header>
    `;
}

function renderInputForm() {
    const examples = [
        "I need materials for a medium-sized office three-phase installation",
        "Looking for products for a small home electrical renovation",
        "Need supplies for a large commercial building with lots of lighting",
        "Materials for a single-phase residential installation with 8 rooms"
    ];

    return `
        <div class="bg-gray-100 py-6 px-4 rounded-lg shadow-sm">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">What electrical materials do you need?</h2>
            
            <form id="requirementForm" class="mb-4">
                <div class="flex flex-col md:flex-row gap-2">
                    <div class="flex-grow relative">
                        <input
                            type="text"
                            id="requirementInput"
                            value="${state.input}"
                            placeholder="Describe your requirements in natural language..."
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F52BA] focus:border-transparent transition-all"
                        />
                        <svg class="absolute right-3 top-3 text-gray-400 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                    </div>
                    <button
                        type="submit"
                        class="${
                            state.isLoading || !state.input.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#0F52BA] hover:bg-[#0D47A1] transition-colors'
                        } px-6 py-3 rounded-lg font-medium text-white"
                        ${state.isLoading || !state.input.trim() ? 'disabled' : ''}
                    >
                        ${state.isLoading ? `
                            <span class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Processing...
                            </span>
                        ` : 'Get Suggestions'}
                    </button>
                </div>
            </form>
            
            <div class="mt-4">
                <p class="text-sm text-gray-600 mb-2">Example searches:</p>
                <div class="flex flex-wrap gap-2">
                    ${examples.map(example => `
                        <button
                            class="example-search text-xs px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-gray-700"
                            data-example="${example}"
                        >
                            ${example}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderProducts() {
    if (state.isLoading) {
        return `
            <div class="mt-12 text-center text-gray-500">
                <p class="text-lg">Processing your requirements...</p>
            </div>
        `;
    }

    if (!state.suggestions.length) {
        return `
            <div class="mt-12 text-center text-gray-500">
                <p class="text-lg">Enter your requirements above to get product suggestions</p>
            </div>
        `;
    }

    const selectedItems = state.suggestions.filter(item => item.selected);
    
    return `
        <div class="mt-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2">
                    ${renderProductList()}
                </div>
                <div class="lg:col-span-1">
                    ${renderOrderSummary(selectedItems)}
                </div>
            </div>
        </div>
    `;
}

function renderProductList() {
    return `
        <div class="my-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
                    Suggested Products (${state.suggestions.length})
                </h2>
                
                <div class="flex items-center space-x-1">
                    <svg class="w-4 h-4 text-gray-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                    </svg>
                    <div class="flex flex-wrap gap-1" id="categoryFilters">
                        ${['All', ...Object.values(ProductCategory)].map(category => `
                            <button
                                class="category-filter px-3 py-1 text-sm rounded-full transition-colors ${
                                    category === 'All'
                                        ? 'bg-[#0F52BA] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }"
                                data-category="${category}"
                            >
                                ${category}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${state.suggestions.map(suggestion => renderProductCard(suggestion)).join('')}
            </div>
        </div>
    `;
}

function renderProductCard(suggestion) {
    const { product, suggestedQuantity, selected } = suggestion;
    const totalPrice = product.price * suggestedQuantity;

    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${
            selected ? 'ring-2 ring-[#0F52BA]' : 'hover:shadow-lg'
        }">
            <div class="relative">
                <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    class="w-full h-48 object-cover"
                />
                <div class="absolute top-2 right-2">
                    <span class="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        ${product.category}
                    </span>
                </div>
            </div>
            
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-1">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-3">${product.description}</p>
                
                <div class="flex justify-between items-center mb-3">
                    <span class="text-lg font-bold text-gray-900">
                        $${product.price.toFixed(2)} <span class="text-xs font-normal">per ${product.unit}</span>
                    </span>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <button 
                            class="quantity-btn w-8 h-8 flex items-center justify-center rounded-full ${
                                suggestedQuantity <= 1 
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }"
                            data-action="decrement"
                            data-product-id="${product.id}"
                            ${suggestedQuantity <= 1 ? 'disabled' : ''}
                        >
                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </button>
                        
                        <input
                            type="number"
                            min="1"
                            value="${suggestedQuantity}"
                            class="quantity-input w-16 text-center border rounded p-1"
                            data-product-id="${product.id}"
                        />
                        
                        <button 
                            class="quantity-btn w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                            data-action="increment"
                            data-product-id="${product.id}"
                        >
                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                        </button>
                    </div>
                    
                    <button
                        class="select-product-btn flex items-center justify-center rounded-md px-3 py-1 transition-colors ${
                            selected
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-[#0F52BA] text-white hover:bg-[#0D47A1]'
                        }"
                        data-product-id="${product.id}"
                    >
                        ${selected ? `
                            <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span>Selected</span>
                        ` : 'Select'}
                    </button>
                </div>
                
                <div class="mt-3 text-right">
                    <span class="text-sm font-semibold text-gray-700">
                        Total: $${totalPrice.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function renderOrderSummary(selectedItems) {
    if (selectedItems.length === 0) {
        return `
            <div class="bg-gray-50 rounded-lg p-6 mt-6 shadow-sm border border-gray-200">
                <div class="flex flex-col items-center justify-center text-gray-500 py-6">
                    <svg class="w-10 h-10 mb-2 opacity-40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    <p>No products selected yet</p>
                    <p class="text-sm mt-1">Select products to build your order</p>
                </div>
            </div>
        `;
    }

    const totalItems = selectedItems.reduce((sum, item) => sum + item.suggestedQuantity, 0);
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.product.price * item.suggestedQuantity), 0);

    return `
        <div class="bg-white rounded-lg shadow-md p-6 mt-6 border border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-[#0F52BA]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                Order Summary
            </h2>
            
            <div class="space-y-4">
                <div class="pb-3 border-b">
                    <p class="text-gray-600">Customer: <span class="font-medium text-gray-800">${state.customerName || 'Guest Customer'}</span></p>
                </div>
                
                <div class="max-h-60 overflow-y-auto pr-2">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="py-2 px-1 text-sm font-medium text-gray-500">Product</th>
                                <th class="py-2 px-1 text-sm font-medium text-gray-500 text-right">Qty</th>
                                <th class="py-2 px-1 text-sm font-medium text-gray-500 text-right">Price</th>
                                <th class="py-2 px-1 text-sm font-medium text-gray-500 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${selectedItems.map(item => `
                                <tr>
                                    <td class="py-2 px-1 text-sm">
                                        <div class="font-medium text-gray-900">${item.product.name}</div>
                                        <div class="text-xs text-gray-500">${item.product.category}</div>
                                    </td>
                                    <td class="py-2 px-1 text-sm text-right">
                                        ${item.suggestedQuantity} ${item.product.unit === 'meter' ? 'm' : ''}
                                    </td>
                                    <td class="py-2 px-1 text-sm text-right">
                                        $${item.product.price.toFixed(2)}
                                    </td>
                                    <td class="py-2 px-1 text-sm text-right font-medium">
                                        $${(item.product.price * item.suggestedQuantity).toFixed(2)}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="pt-3 border-t">
                    <div class="flex justify-between font-medium text-gray-800">
                        <span>Total (${selectedItems.length} products, ${totalItems} items):</span>
                        <span class="text-lg">$${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="pt-4">
                    <button
                        id="placeOrderBtn"
                        class="w-full bg-[#0F52BA] text-white py-2 px-4 rounded-md font-medium hover:bg-[#0D47A1] transition-colors flex items-center justify-center"
                    >
                        <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderOrderConfirmation() {
    if (!state.currentOrder) return '';
    
    return `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-fade-in">
                <div class="bg-green-50 p-6 flex flex-col items-center">
                    <div class="bg-green-100 p-3 rounded-full mb-4">
                        <svg class="w-10 h-10 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
                    <p class="text-gray-600 text-center">
                        Your order has been successfully created and saved.
                    </p>
                </div>
                
                <div class="p-6">
                    <div class="mb-6 bg-gray-50 p-4 rounded-lg">
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-600">Order ID:</span>
                            <span class="font-medium">${state.currentOrder.id}</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-600">Customer:</span>
                            <span class="font-medium">${state.currentOrder.customer}</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-600">Date:</span>
                            <span class="font-medium">${new Date(state.currentOrder.date).toLocaleDateString()}</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-600">Items:</span>
                            <span class="font-medium">${state.currentOrder.items.length} products</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Total:</span>
                            <span class="font-bold">$${state.currentOrder.total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <p class="text-sm text-gray-600 mb-4 text-center">
                        This order has been saved and is ready for processing by your ERP system.
                    </p>
                    
                    <div class="flex gap-3">
                        <button
                            id="newOrderBtn"
                            class="flex-1 bg-[#0F52BA] text-white py-3 px-4 rounded-md font-medium hover:bg-[#0D47A1] transition-colors flex items-center justify-center"
                        >
                            <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="1 4 1 10 7 10"/>
                                <polyline points="23 20 23 14 17 14"/>
                                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                            </svg>
                            Start New Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Attach event listeners after rendering
function attachEventListeners() {
    // Customer name input
    const customerNameInput = document.getElementById('customerName');
    if (customerNameInput) {
        customerNameInput.addEventListener('input', (e) => {
            state.customerName = e.target.value;
        });
    }
    
    // Requirement form
    const requirementForm = document.getElementById('requirementForm');
    if (requirementForm) {
        requirementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('requirementInput') as HTMLInputElement;
            if (input && input.value.trim()) {
                handleRequirementSubmit(input.value.trim());
            }
        });
    }
    
    // Example searches
    const exampleButtons = document.querySelectorAll('.example-search');
    exampleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const example = button.getAttribute('data-example');
            if (example) {
                const input = document.getElementById('requirementInput') as HTMLInputElement;
                if (input) {
                    input.value = example;
                    state.input = example;
                }
            }
        });
    });
    
    // Quantity buttons
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            const productId = btn.getAttribute('data-product-id');
            if (productId) {
                const suggestion = state.suggestions.find(s => s.product.id === productId);
                if (suggestion) {
                    const newQuantity = action === 'increment' 
                        ? suggestion.suggestedQuantity + 1 
                        : Math.max(1, suggestion.suggestedQuantity - 1);
                    handleQuantityChange(productId, newQuantity);
                }
            }
        });
    });
    
    // Quantity inputs
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = input.getAttribute('data-product-id');
            if (productId) {
                const value = parseInt((e.target as HTMLInputElement).value);
                if (!isNaN(value) && value >= 1) {
                    handleQuantityChange(productId, value);
                }
            }
        });
    });
    
    // Select product buttons
    const selectBtns = document.querySelectorAll('.select-product-btn');
    selectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-product-id');
            if (productId) {
                handleToggleSelect(productId);
            }
        });
    });
    
    // Place order button
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }
    
    // New order button
    const newOrderBtn = document.getElementById('newOrderBtn');
    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', handleNewOrder);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    render();
});