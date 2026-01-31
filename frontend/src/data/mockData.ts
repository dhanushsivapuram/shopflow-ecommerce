// Mock data structures designed for easy backend integration
// Field names are kept simple and backend-friendly

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: CartItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// Mock Products
export const products: Product[] = [
  {
    id: "prod_001",
    name: "Minimal Desk Lamp",
    price: 89.99,
    description: "A sleek, modern desk lamp with adjustable brightness and warm LED lighting. Perfect for your workspace or bedside table. Features touch controls and a weighted base for stability.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
    stock: 24,
    category: "Lighting"
  },
  {
    id: "prod_002",
    name: "Wireless Earbuds Pro",
    price: 149.99,
    description: "Premium wireless earbuds with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. IPX4 water resistant for workouts.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop",
    stock: 56,
    category: "Electronics"
  },
  {
    id: "prod_003",
    name: "Leather Minimalist Wallet",
    price: 59.99,
    description: "Handcrafted genuine leather wallet with RFID blocking technology. Slim design holds up to 8 cards and cash. Available in black and tan.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop",
    stock: 89,
    category: "Accessories"
  },
  {
    id: "prod_004",
    name: "Smart Watch Series X",
    price: 299.99,
    description: "Advanced smartwatch with health monitoring, GPS, and 5-day battery life. Water resistant to 50m. Compatible with iOS and Android.",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop",
    stock: 32,
    category: "Electronics"
  },
  {
    id: "prod_005",
    name: "Ceramic Pour-Over Set",
    price: 45.99,
    description: "Artisan ceramic pour-over coffee maker with matching cup. Makes the perfect single cup of coffee every time. Dishwasher safe.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop",
    stock: 67,
    category: "Kitchen"
  },
  {
    id: "prod_006",
    name: "Organic Cotton Backpack",
    price: 79.99,
    description: "Sustainable backpack made from organic cotton canvas. Features padded laptop sleeve, multiple pockets, and adjustable straps.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    stock: 41,
    category: "Bags"
  },
  {
    id: "prod_007",
    name: "Bamboo Desk Organizer",
    price: 34.99,
    description: "Eco-friendly bamboo desk organizer with compartments for pens, phones, and small items. Natural finish complements any workspace.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&h=500&fit=crop",
    stock: 78,
    category: "Office"
  },
  {
    id: "prod_008",
    name: "Noise-Canceling Headphones",
    price: 249.99,
    description: "Over-ear headphones with industry-leading noise cancellation. 40-hour battery, premium comfort padding, and Hi-Res audio support.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    stock: 19,
    category: "Electronics"
  }
];

// Mock Orders
export const orders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    total: 239.98,
    status: "completed",
    items: [
      { productId: "prod_001", quantity: 1, product: products[0] },
      { productId: "prod_003", quantity: 2, product: products[2] }
    ]
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-20",
    total: 149.99,
    status: "processing",
    items: [
      { productId: "prod_002", quantity: 1, product: products[1] }
    ]
  }
];

// Helper functions for cart management (can be replaced with API calls)
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};
