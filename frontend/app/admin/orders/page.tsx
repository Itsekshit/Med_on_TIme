"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  User,
  Store,
  Clock,
  MapPin,
  Phone,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const statuses = [
  "PENDING",
  "ACCEPTED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

type AdminOrder = {
  id: number;
  totalAmount: number;
  deliveryAddress: string;
  pincode: string;
  phone: string;
  status: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  store: {
    name: string;
    address: string;
  };
  items: {
    id: number;
    quantity: number;
    price: number;
    product: {
      name: string;
      category: string;
    };
  }[];
};

export default function AdminOrdersPage() {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.role !== "ADMIN") {
      alert("Access denied. Admin only.");
      router.push("/");
      return;
    }

    setAllowed(true);
  }, [router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orders`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to fetch orders");
        return;
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Admin orders fetch failed:", error);
      alert("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allowed) {
      fetchOrders();
    }
  }, [allowed]);

  const updateStatus = async (orderId: number, status: string) => {
    try {
      setUpdatingId(orderId);

      const res = await fetch(
        `${API_BASE_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Status update failed");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert("Backend connection failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  const getStatusClass = (status: string) => {
    if (status === "DELIVERED") return "bg-green-100 text-green-700";
    if (status === "OUT_FOR_DELIVERY") return "bg-blue-100 text-blue-700";
    if (status === "ACCEPTED") return "bg-yellow-100 text-yellow-700";
    if (status === "CANCELLED") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount),
    0
  );

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  if (!allowed || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
        <div className="rounded-3xl bg-white p-8 text-center shadow">
          <ShieldCheck className="mx-auto mb-3 text-green-600" size={36} />
          <p className="font-semibold text-gray-700">Checking admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#111827]">
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Home
          </button>

          <div className="text-center">
            <h1 className="text-xl font-extrabold text-green-600">
              Admin Dashboard
            </h1>
            <p className="text-xs text-gray-500">Manage medicine orders</p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8 grid gap-5 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white p-6 shadow"
          >
            <Package className="mb-3 text-green-600" />
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="text-3xl font-extrabold">{orders.length}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl bg-white p-6 shadow"
          >
            <Clock className="mb-3 text-orange-500" />
            <p className="text-sm text-gray-500">Pending</p>
            <h2 className="text-3xl font-extrabold">{pendingOrders}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-white p-6 shadow"
          >
            <Package className="mb-3 text-blue-600" />
            <p className="text-sm text-gray-500">Delivered</p>
            <h2 className="text-3xl font-extrabold">{deliveredOrders}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl bg-white p-6 shadow"
          >
            <IndianRupee className="mb-3 text-green-600" />
            <p className="text-sm text-gray-500">Revenue</p>
            <h2 className="text-3xl font-extrabold">₹{totalRevenue}</h2>
          </motion.div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold">All Orders</h2>
              <p className="text-gray-500">
                Update status: Pending, Accepted, Out for Delivery, Delivered.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-3xl border border-dashed bg-white p-12 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="overflow-hidden rounded-3xl bg-white shadow"
                >
                  <div className="border-b bg-gradient-to-r from-green-50 to-white p-5">
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order #{order.id}
                        </p>

                        <h3 className="mt-1 text-xl font-extrabold">
                          {order.store.name}
                        </h3>

                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <Store size={15} />
                          {order.store.address}
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={15} />
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-2xl font-extrabold text-green-600">
                          ₹{order.totalAmount}
                        </p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 lg:grid-cols-[1fr_280px]">
                    <div>
                      <div className="mb-4 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl bg-gray-50 p-4">
                          <p className="mb-1 flex items-center gap-2 text-sm font-bold">
                            <User size={15} />
                            Customer
                          </p>
                          <p className="text-sm text-gray-700">
                            {order.user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.user.email}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                          <p className="mb-1 flex items-center gap-2 text-sm font-bold">
                            <MapPin size={15} />
                            Delivery
                          </p>
                          <p className="text-sm text-gray-700">
                            {order.deliveryAddress}, {order.pincode}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <Phone size={13} />
                            {order.phone}
                          </p>
                        </div>
                      </div>

                      <h4 className="mb-3 font-bold">Items</h4>

                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between rounded-2xl bg-gray-50 p-4"
                          >
                            <div>
                              <p className="font-semibold">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.product.category}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                              <p className="font-bold">
                                ₹{item.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border p-4">
                      <h4 className="mb-3 font-bold">Update Status</h4>

                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value)
                        }
                        className="w-full rounded-xl border p-3 outline-none"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <p className="mt-3 text-xs text-gray-500">
                        Customer can see this updated status in account page.
                      </p>

                      {updatingId === order.id && (
                        <p className="mt-3 text-sm text-green-600">
                          Updating...
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}