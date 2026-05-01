"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, MapPin, Package } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const statusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "OUT_FOR_DELIVERY":
      return "bg-blue-100 text-blue-700";
    case "ACCEPTED":
      return "bg-yellow-100 text-yellow-700";
    case "PENDING":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-red-100 text-red-700";
  }
};

export default function AccountPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/login");
      return;
    }

    fetch(`${API_BASE_URL}/api/orders/${userId}`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-3xl shadow p-6"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="font-bold text-lg">
                    {order.store.name}
                  </h2>
                  <p className="text-sm text-gray-500 flex gap-2 items-center">
                    <MapPin size={14} />
                    {order.store.address}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${statusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* ITEMS */}
              <div className="space-y-2">
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="mt-4 flex justify-between items-center border-t pt-4">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Clock size={14} />
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <p className="text-lg font-extrabold text-green-600">
                  ₹{order.totalAmount}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}