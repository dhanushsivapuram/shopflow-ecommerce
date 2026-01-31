import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import OrderCard from "@/components/orders/OrderCard";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";
import API from '@/config/api';


const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/api/orders/my`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Layout>
      <div className="container-custom py-8 md:py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          My Orders
        </h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-8">
              When you make a purchase, your orders will appear here.
            </p>
            <Link to="/">
              <Button size="lg">
                Start Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
