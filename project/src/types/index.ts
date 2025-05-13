// Type definitions for the application

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: string;
  image: string;
  minQuantity: number;
}

export enum ProductCategory {
  WIRING = "Wiring",
  PROTECTION = "Protection",
  ENCLOSURES = "Enclosures",
  EQUIPMENT = "Equipment",
  CONNECTORS = "Connectors",
  ACCESSORIES = "Accessories"
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  items: OrderItem[];
  total: number;
}

export interface ProductSuggestion {
  product: Product;
  suggestedQuantity: number;
  selected: boolean;
}