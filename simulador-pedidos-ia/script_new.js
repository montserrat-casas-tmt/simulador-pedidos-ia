// Estado global de la aplicación
let products = [];
let cart = []; // Ahora incluirá { product, quantity }

// Elementos del DOM
const elements = {
    userNeed: document.getElementById('userNeed'),
    searchBtn: document.getElementById('searchBtn'),
    results: document.getElementById('results'),
    cart: document.getElementById('cart'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    generateOrderBtn: document.getElementById('generateOrderBtn'),
    catalogUpload: document.getElementById('catalogUpload'),
    jsonModal: document.getElementById('jsonModal'),
    jsonOutput: document.getElementById('jsonOutput'),
    copyJsonBtn: document.getElementById('copyJsonBtn'),
    closeModalBtn: document.getElementById('closeModalBtn')
};

// Funciones de utilidad
const formatPrice = (price) => Number(price).toFixed(2) + '€';

const loadSampleProducts = () => {
    const sampleProducts = [
        { id: 1, name: 'Aire Acondicionado Split', price: 599.99, description: 'Split inverter 3000 frigorías', category: 'Climatización' },
        { id: 2, name: 'Caldera de Gas', price: 899.99, description: 'Caldera de condensación 24kW', category: 'Calefacción' },
        { id: 3, name: 'Bomba de Calor', price: 1299.99, description: 'Aerotermia para calefacción y ACS', category: 'Climatización' }
    ];
    localStorage.setItem('products', JSON.stringify(sampleProducts));
    products = sampleProducts;
};

// Cargar productos del localStorage o usar muestra
const loadProducts = () => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        loadSampleProducts();
    }
};

// Renderizar un producto
const createProductCard = (product) => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md p-6 flex flex-col';
    card.innerHTML = `
        <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
        <p class="text-gray-600 mb-4 flex-grow">${product.description}</p>
        <div class="flex justify-between items-center">
            <span class="text-lg font-bold">${formatPrice(product.price)}</span>
            <button class="add-to-cart bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    data-product-id="${product.id}">
                <i class="fas fa-cart-plus mr-2"></i>Añadir
            </button>
        </div>
    `;
    return card;
};

// Buscar productos basados en la necesidad del usuario
const searchProducts = (need) => {
    // Implementar lógica de búsqueda basada en palabras clave
    const keywords = need.toLowerCase().split(' ');
    return products.filter(product => 
        keywords.some(keyword => 
            product.name.toLowerCase().includes(keyword) ||
            product.description.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword)
        )
    );
};

// Actualizar la visualización del carrito
const updateCart = () => {
    elements.cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between items-center mb-2';
        itemElement.innerHTML = `
            <span class="flex-grow">${item.product.name}</span>
            <div class="flex items-center mx-2">
                <button class="quantity-btn decrease text-gray-600 px-2" data-product-id="${item.product.id}">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="mx-2">${item.quantity}</span>
                <button class="quantity-btn increase text-gray-600 px-2" data-product-id="${item.product.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <span class="mx-4">${formatPrice(item.product.price * item.quantity)}</span>
            <button class="remove-from-cart text-red-600 hover:text-red-800" data-product-id="${item.product.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        elements.cartItems.appendChild(itemElement);
        total += Number(item.product.price) * item.quantity;
    });

    elements.cartTotal.textContent = formatPrice(total);
    elements.cart.classList.toggle('hidden', cart.length === 0);
};

// Manejar la carga de archivos CSV
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n');
            const headers = lines[0].split(',');
            
            const newProducts = lines.slice(1).map((line, index) => {
                const values = line.split(',');
                return {
                    id: index + products.length + 1,
                    name: values[0],
                    description: values[1] || '',
                    price: parseFloat(values[2]) || 0,
                    category: values[3] || 'General'
                };
            }).filter(product => product.name && product.price);

            products = [...products, ...newProducts];
            localStorage.setItem('products', JSON.stringify(products));
            alert('Catálogo actualizado correctamente');
        };
        reader.readAsText(file);
    }
};

// Generar pedido en formato JSON
const generateOrder = () => {
    const orderItems = cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity
    }));
    
    const order = {
        date: new Date().toISOString(),
        items: orderItems,
        total: cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0)
    };

    elements.jsonOutput.textContent = JSON.stringify(order, null, 2);
    elements.jsonModal.classList.remove('hidden');
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    elements.searchBtn.addEventListener('click', () => {
        const need = elements.userNeed.value.trim();
        if (need) {
            const matchedProducts = searchProducts(need);
            elements.results.innerHTML = '';
            matchedProducts.forEach(product => {
                elements.results.appendChild(createProductCard(product));
            });
        }
    });

    elements.results.addEventListener('click', (e) => {
        const addButton = e.target.closest('.add-to-cart');
        if (addButton) {
            const productId = Number(addButton.dataset.productId);
            const product = products.find(p => p.id === productId);
            
            const existingItem = cart.find(item => item.product.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    product: product,
                    quantity: 1
                });
            }
            updateCart();
        }
    });

    elements.cartItems.addEventListener('click', (e) => {
        const removeButton = e.target.closest('.remove-from-cart');
        const decreaseButton = e.target.closest('.quantity-btn.decrease');
        const increaseButton = e.target.closest('.quantity-btn.increase');
        
        if (removeButton) {
            const productId = Number(removeButton.dataset.productId);
            cart = cart.filter(item => item.product.id !== productId);
            updateCart();
        } else if (decreaseButton) {
            const productId = Number(decreaseButton.dataset.productId);
            const item = cart.find(item => item.product.id === productId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                updateCart();
            }
        } else if (increaseButton) {
            const productId = Number(increaseButton.dataset.productId);
            const item = cart.find(item => item.product.id === productId);
            if (item) {
                item.quantity += 1;
                updateCart();
            }
        }
    });

    elements.generateOrderBtn.addEventListener('click', generateOrder);
    elements.catalogUpload.addEventListener('change', handleFileUpload);
    elements.copyJsonBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(elements.jsonOutput.textContent);
        alert('Pedido copiado al portapapeles');
    });
    elements.closeModalBtn.addEventListener('click', () => {
        elements.jsonModal.classList.add('hidden');
    });
});
