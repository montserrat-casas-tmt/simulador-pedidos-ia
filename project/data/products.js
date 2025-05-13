export const ProductCategory = {
    WIRING: "Wiring",
    PROTECTION: "Protection",
    ENCLOSURES: "Enclosures",
    EQUIPMENT: "Equipment",
    CONNECTORS: "Connectors",
    ACCESSORIES: "Accessories"
};

// Mock product database
export const products = [
    {
        id: "wire-001",
        name: "2.5mm² Copper Cable",
        description: "Flexible copper cable for general electrical installations",
        category: ProductCategory.WIRING,
        price: 0.95,
        unit: "meter",
        image: "https://images.pexels.com/photos/2881632/pexels-photo-2881632.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        minQuantity: 10
    },
    {
        id: "wire-002",
        name: "4mm² Copper Cable",
        description: "Heavy duty copper cable for power circuits",
        category: ProductCategory.WIRING,
        price: 1.45,
        unit: "meter",
        image: "https://images.pexels.com/photos/162568/oil-pump-pump-jack-donkey-sunset-162568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        minQuantity: 10
    },
    {
        id: "wire-003",
        name: "6mm² Three-Phase Cable",
        description: "Three-phase installation cable",
        category: ProductCategory.WIRING,
        price: 2.75,
        unit: "meter",
        image: "https://images.pexels.com/photos/8926541/pexels-photo-8926541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        minQuantity: 5
    },
    {
        id: "prot-001",
        name: "16A MCB Circuit Breaker",
        description: "Miniature circuit breaker for general protection",
        category: ProductCategory.PROTECTION,
        price: 8.50,
        unit: "piece",
        image: "https://images.pexels.com/photos/3682293/pexels-photo-3682293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        minQuantity: 1
    },
    {
        id: "prot-002",
        name: "32A Three-Phase Circuit Breaker",
        description: "Three-phase circuit breaker for main distribution",
        category: ProductCategory.PROTECTION,
        price: 24.95,
        unit: "piece",
        image: "https://images.pexels.com/photos/2988232/pexels-photo-2988232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        minQuantity: 1
    },
    {
        id: "prot-003",
        name: "40A RCD Safety Switch",
        description: "Residual current device for electric shock protection",
        category: ProductCategory.PROTECTION,
        price: 32.50,
        unit: "piece",
        image: "https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        minQuantity: 1
    },
    {
        id: "enc-001",
        name: "12-Module Distribution Box",
        description: "Surface mounted distribution box for electrical panels",
        category: ProductCategory.ENCLOSURES,
        price: 18.75,
        unit: "piece",
        image: "https://images.pexels.com/photos/236748/pexels-photo-236748.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        minQuantity: 1
    },
    {
        id: "enc-002",
        name: "24-Module Distribution Box",
        description: "Large distribution box for commercial installations",
        category: ProductCategory.ENCLOSURES,
        price: 28.95,
        unit: "piece",
        image: "https://images.pexels.com/photos/9436715/pexels-photo-9436715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        minQuantity: 1
    },
    {
        id: "acc-001",
        name: "Cable Gland Pack",
        description: "Assorted cable glands for secure cable entry",
        category: ProductCategory.ACCESSORIES,
        price: 5.25,
        unit: "pack",
        image: "https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        minQuantity: 1
    },
    {
        id: "acc-002",
        name: "Terminal Block Strip",
        description: "10-connection terminal block for wire connections",
        category: ProductCategory.CONNECTORS,
        price: 3.80,
        unit: "piece",
        image: "https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        minQuantity: 2
    },
    {
        id: "eqp-001",
        name: "Three-Phase Power Socket",
        description: "Industrial three-phase power socket",
        category: ProductCategory.EQUIPMENT,
        price: 12.50,
        unit: "piece",
        image: "https://images.pexels.com/photos/2988232/pexels-photo-2988232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        minQuantity: 1
    },
    {
        id: "eqp-002",
        name: "Industrial Light Fixture",
        description: "LED industrial lighting fixture for commercial spaces",
        category: ProductCategory.EQUIPMENT,
        price: 45.00,
        unit: "piece",
        image: "https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        minQuantity: 1
    }
];

// Function to get product by ID
export function getProductById(id) {
    return products.find(product => product.id === id);
}