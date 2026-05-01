"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Lock, Phone, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!name || !phone || !password) {
      alert("Please fill all fields");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful");
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f8fc] px-4">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-green-200 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-blue-200 blur-3xl" />

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/")}
        className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow"
      >
        <ArrowLeft size={16} />
        Home
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/60 bg-white/90 p-7 shadow-2xl backdrop-blur"
      >
        <div className="mb-6 text-center">
          <motion.div
            initial={{ scale: 0.7, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl"
          >
            💊
          </motion.div>

          <h2 className="text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Join MedOnTime and order medicines faster.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center rounded-2xl border bg-gray-50 px-4 py-3 focus-within:border-green-600 focus-within:bg-white">
            <User size={18} className="text-green-600" />
            <input
              type="text"
              placeholder="Full Name"
              className="ml-3 w-full bg-transparent text-black outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex items-center rounded-2xl border bg-gray-50 px-4 py-3 focus-within:border-green-600 focus-within:bg-white">
            <Phone size={18} className="text-green-600" />
            <input
              type="tel"
              placeholder="Mobile Number"
              maxLength={10}
              className="ml-3 w-full bg-transparent text-black outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <div className="flex items-center rounded-2xl border bg-gray-50 px-4 py-3 focus-within:border-green-600 focus-within:bg-white">
            <Lock size={18} className="text-green-600" />
            <input
              type="password"
              placeholder="Password"
              className="ml-3 w-full bg-transparent text-black outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={register}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700 disabled:bg-green-400"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Creating Account..." : "Create Account"}
          </motion.button>
        </div>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-bold text-green-600"
          >
            Login
          </button>
        </p>
      </motion.div>
    </div>
  );
}