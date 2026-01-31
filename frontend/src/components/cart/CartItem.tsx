import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

/* ✅ Backend-compatible types */
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

/* ✅ Props */
interface CartItemProps {
  item: CartItem;
}

/* ✅ Price formatter */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const CartItemComponent = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
      {/* Product Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-medium text-foreground">
          {item.product.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatPrice(item.product.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            updateQuantity(item.product._id, item.quantity - 1)
          }
        >
          <Minus className="w-4 h-4" />
        </Button>

        <span className="w-8 text-center font-medium">
          {item.quantity}
        </span>

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            updateQuantity(item.product._id, item.quantity + 1)
          }
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Remove */}
      <Button
        size="icon"
        variant="ghost"
        className="text-destructive"
        onClick={() => removeFromCart(item.product._id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CartItemComponent;
