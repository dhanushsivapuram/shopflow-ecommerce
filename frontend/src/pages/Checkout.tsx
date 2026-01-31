import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import API from '@/config/api';


/* ✅ Price formatter (no mockData) */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const Checkout = () => {
  const { items, getTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  /* 🔒 Hard redirect protection */
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    if (items.length === 0) navigate('/cart');
  }, [isAuthenticated, items.length, navigate]);


  const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


  /* ✅ PLACEHOLDER: create order + payment */
  const handlePayment = async () => {
  try {
    setIsProcessing(true);

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    // 1️⃣ Create order in backend
    const orderRes = await fetch(`${API}/api/orders`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    items: items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    })),
    totalAmount: total,
  }),
});


    if (!orderRes.ok) {
      const err = await orderRes.json();
      throw new Error(err.message || "Order failed");
    }

    const order = await orderRes.json();

    // 2️⃣ Create Razorpay order
   const paymentRes = await fetch(
  `${API}/api/payment/razorpay/create`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId: order._id }),
  }
);


    if (!paymentRes.ok) {
      const err = await paymentRes.json();
      throw new Error(err.message || "Razorpay order failed");
    }

    const paymentData = await paymentRes.json();

    // 3️⃣ Load Razorpay SDK
    const loaded = await loadRazorpay();
    if (!loaded) throw new Error("Razorpay SDK failed to load");

    // 4️⃣ Open Razorpay
    const options = {
      key: paymentData.key,
      amount: paymentData.amount,
      currency: "INR",
      name: "ShopFlow",
      description: "Order Payment",
      order_id: paymentData.razorpayOrderId,

      handler: async function (response: any) {
        const verifyRes = await fetch(
  `${API}/api/payment/razorpay/verify`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      orderId: order._id,
    }),
  }
);


        if (!verifyRes.ok) {
          throw new Error("Payment verification failed");
        }

        clearCart();
        navigate("/order-success", {
          state: { orderId: order._id, total: order.totalAmount },
        });
      },

      theme: { color: "#6366f1" },
    };

    new (window as any).Razorpay(options).open();
  } catch (error: any) {
    console.error("PAYMENT ERROR:", error.message);
    alert(error.message || "Payment failed");
  } finally {
    setIsProcessing(false);
  }
};





  return (
    <Layout>
      <div className="container-custom py-8 md:py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div
                    key={item.product._id}
                    className="flex gap-4"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium text-foreground">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">
                    {formatPrice(tax)}
                  </span>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">
                      Total
                    </span>
                    <span className="text-xl font-bold text-foreground">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="order-1 lg:order-2">
            <div
              className="bg-card rounded-xl border border-border p-6 animate-fade-in"
              style={{ animationDelay: '100ms' }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Payment Details
              </h2>

              {/* User Info */}
              <div className="mb-6 p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Billing to:
                </p>
                <p className="font-medium text-foreground">
                  {user?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user?.email}
                </p>
              </div>

              {/* Demo Payment */}
              <div className="p-4 bg-secondary rounded-lg text-center mb-6">
                <CreditCard className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Demo checkout. Razorpay will be connected next.
                </p>
              </div>

              <Button
                className="w-full h-12"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Pay {formatPrice(total)}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
