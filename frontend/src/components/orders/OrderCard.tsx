import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

/* Backend Order type (IMPORTANT) */
interface Order {
  _id: string;
  items: {
    product: {
      name: string;
      image: string;
      price: number;
    };
    quantity: number;
  }[];
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
}

/* Props */
interface OrderCardProps {
  order: Order;
}

/* Payment status config */
const statusConfig: Record<string, any> = {
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-warning/10 text-warning",
  },
  paid: {
    icon: CheckCircle,
    label: "Paid",
    className: "bg-success/10 text-success",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "bg-destructive/10 text-destructive",
  },
};

/* Price formatter */
const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const OrderCard = ({ order }: OrderCardProps) => {
  const status =
    statusConfig[order.paymentStatus] || statusConfig["pending"];

  const StatusIcon = status.icon;

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">
            Order #{order._id}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Ordered on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${status.className}`}
        >
          <StatusIcon className="w-4 h-4" />
          {status.label}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-1">
                {item.product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Qty: {item.quantity}
              </p>
            </div>

            <p className="text-sm font-medium text-foreground">
              {formatPrice(item.product.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-lg font-semibold text-foreground">
          {formatPrice(order.totalAmount)}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
