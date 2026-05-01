"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  User,
  LogOut,
  Wallet,
  CheckCircle,
  Circle,
  Truck,
  PackageCheck,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const orderSteps = [
  { key: "PENDING", label: "Order Placed", icon: CheckCircle },
  { key: "ACCEPTED", label: "Accepted", icon: PackageCheck },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

const getStepIndex = (status: string) => {
  if (status === "PAID" || status === "PENDING") return 0;
  if (status === "ACCEPTED") return 1;
  if (status === "OUT_FOR_DELIVERY") return 2;
  if (status === "DELIVERED") return 3;
  return 0;
};

const statusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "OUT_FOR_DELIVERY":
      return "bg-blue-100 text-blue-700";
    case "ACCEPTED":
      return "bg-yellow-100 text-yellow-700";
    case "PAID":
    case "PENDING":
      return "bg-gray-100 text-gray-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function AccountPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum: number, order: any) => sum + Number(order.totalAmount || 0),
    0
  );

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const storedUser = localStorage.getItem("user");

    if (!userId || !storedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));

    const savedAddress = localStorage.getItem("savedAddress");
    const savedPincode = localStorage.getItem("savedPincode");

    if (savedAddress) setAddress(savedAddress);
    if (savedPincode) setPincode(savedPincode);

    fetch(`${API_BASE_URL}/api/orders/${userId}`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, [router]);

  const saveAddress = () => {
    localStorage.setItem("savedAddress", address);
    localStorage.setItem("savedPincode", pincode);
    alert("Address saved ✅");
  };

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f8fc]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* PROFILE */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-6 shadow"
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
                <User className="text-green-600" /> My Profile
              </h2>

              <p>
                <b>Name:</b> {user?.name}
              </p>
              <p>
                <b>Mobile:</b> {user?.phone}
              </p>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 font-bold text-red-500"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>

          <div className="mt-6">
            <h3 className="mb-2 font-bold">Saved Address</h3>

            <input
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mb-3 w-full rounded-xl border p-3 text-black outline-none"
            />

            <input
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="mb-3 w-full rounded-xl border p-3 text-black outline-none"
            />

            <button
              onClick={saveAddress}
              className="rounded-xl bg-green-600 px-5 py-2 font-bold text-white"
            >
              Save Address
            </button>
          </div>
        </motion.div>

        {/* SUMMARY */}
        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white p-6 text-center shadow"
          >
            <h3 className="text-sm text-gray-500">Total Orders</h3>
            <p className="text-3xl font-extrabold">{totalOrders}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl bg-white p-6 text-center shadow"
          >
            <h3 className="text-sm text-gray-500">Total Spent</h3>
            <p className="text-3xl font-extrabold text-green-600">
              ₹{totalSpent}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-white p-6 text-center shadow"
          >
            <h3 className="flex justify-center gap-2 text-sm text-gray-500">
              <Wallet size={16} /> Payments
            </h3>
            <p className="text-3xl font-extrabold">{totalOrders}</p>
          </motion.div>
        </div>

        {/* ORDERS */}
        <div>
          <h1 className="mb-6 text-3xl font-extrabold">Order Tracking</h1>

          {orders.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center text-gray-500 shadow">
              No orders yet
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => {
                const activeIndex = getStepIndex(order.status);

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-3xl bg-white p-6 shadow"
                  >
                    {/* HEADER */}
                    <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <h2 className="text-lg font-bold">
                          {order.store.name}
                        </h2>
                        <p className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={14} />
                          {order.store.address}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* TRACKING TIMELINE */}
                    {order.status === "CANCELLED" ? (
                      <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600">
                        This order has been cancelled.
                      </div>
                    ) : (
                      <div className="mb-6 rounded-2xl bg-gray-50 p-5">
                        <div className="grid grid-cols-4 gap-2">
                          {orderSteps.map((step, stepIndex) => {
                            const Icon = step.icon;
                            const completed = stepIndex <= activeIndex;

                            return (
                              <div
                                key={step.key}
                                className="relative flex flex-col items-center text-center"
                              >
                                {stepIndex < orderSteps.length - 1 && (
                                  <div
                                    className={`absolute left-1/2 top-5 h-1 w-full ${
                                      stepIndex < activeIndex
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  />
                                )}

                                <motion.div
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: completed ? 1.08 : 1 }}
                                  className={`z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                                    completed
                                      ? "bg-green-600 text-white"
                                      : "bg-gray-200 text-gray-500"
                                  }`}
                                >
                                  {completed ? (
                                    <Icon size={18} />
                                  ) : (
                                    <Circle size={18} />
                                  )}
                                </motion.div>

                                <p
                                  className={`mt-2 text-xs font-semibold ${
                                    completed
                                      ? "text-green-700"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {step.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

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
                    <div className="mt-4 flex flex-col justify-between gap-2 border-t pt-4 md:flex-row md:items-center">
                      <p className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        {new Date(order.createdAt).toLocaleString()}
                      </p>

                      <p className="text-lg font-extrabold text-green-600">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}