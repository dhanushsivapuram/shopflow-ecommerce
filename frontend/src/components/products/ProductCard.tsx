import { Link } from 'react-router-dom';

/* ✅ Backend Product type (MongoDB) */
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
}

/* ✅ Price formatter (moved out of mockData) */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-smooth card-shadow hover:card-shadow-lg"
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-smooth line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>

          {product.category && (
            <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-full">
              {product.category}
            </span>
          )}
        </div>

        <div className="pt-2">
          <span className="inline-block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium group-hover:bg-primary/90 transition-smooth">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
