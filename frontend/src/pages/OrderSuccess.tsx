import { useLocation, Link, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

interface OrderSuccessState {
  orderId: string;
  total: number;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

const OrderSuccess = () => {
  const location = useLocation();
  const state = location.state as OrderSuccessState | null;

  if (!state?.orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container-custom py-16 md:py-24">
        <div className="max-w-lg mx-auto text-center animate-fade-in">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your order. Your payment will be processed shortly.
          </p>

          <div className="bg-card rounded-xl border border-border p-6 mb-8 text-left">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Order Details</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono font-medium text-foreground">
                  {state.orderId}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between text-sm border-t border-border pt-3 mt-3">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(state.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders">
              <Button variant="outline" size="lg">
                View My Orders
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
