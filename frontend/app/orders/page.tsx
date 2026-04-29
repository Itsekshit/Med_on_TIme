"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5000";

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
};

type Order = {
  id: number;
  totalAmount: number;
  createdAt: string;
  store: {
    name: string;
  };
  items: OrderItem[];
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/orders/${userId}`
        );

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-6 py-10">
      <h1 className="mb-6 text-3xl font-extrabold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border p-10 text-center text-gray-500">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <h2 className="font-bold text-lg">
                    {order.store.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Order ID: {order.id}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-600">
                    ₹{order.totalAmount}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm mb-2"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}