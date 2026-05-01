"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, LockKeyhole, Phone } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Login() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "OTP failed");
        return;
      }

      alert("OTP sent successfully. Demo OTP is 123456");
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "OTP verification failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId", String(data.user.id));

      alert("Login successful");
      router.push("/");
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
            🔐
          </motion.div>

          <h2 className="text-3xl font-extrabold text-gray-900">
            Login with OTP
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Fast and secure login for MedOnTime.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center rounded-2xl border bg-gray-50 px-4 py-3 focus-within:border-green-600 focus-within:bg-white">
            <Phone size={18} className="text-green-600" />
            <input
              type="tel"
              placeholder="Mobile Number"
              maxLength={10}
              disabled={otpSent}
              className="ml-3 w-full bg-transparent text-black outline-none disabled:cursor-not-allowed"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <AnimatePresence>
            {otpSent && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="flex items-center rounded-2xl border bg-gray-50 px-4 py-3 focus-within:border-green-600 focus-within:bg-white"
              >
                <LockKeyhole size={18} className="text-green-600" />
                <input
                  type="tel"
                  placeholder="Enter OTP"
                  maxLength={6}
                  className="ml-3 w-full bg-transparent text-black outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!otpSent ? (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={sendOtp}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700 disabled:bg-green-400"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Sending OTP..." : "Send OTP"}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={verifyOtp}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700 disabled:bg-green-400"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Verifying..." : "Verify & Login"}
            </motion.button>
          )}

          {otpSent && (
            <button
              onClick={() => {
                setOtpSent(false);
                setOtp("");
              }}
              className="w-full text-sm font-semibold text-green-600"
            >
              Change mobile number
            </button>
          )}
        </div>

        <div className="mt-5 rounded-2xl bg-green-50 p-3 text-center text-xs text-green-700">
          Demo OTP: <b>123456</b>
        </div>

        <p className="mt-5 text-center text-sm text-gray-600">
          New user?{" "}
          <button
            onClick={() => router.push("/register")}
            className="font-bold text-green-600"
          >
            Create account
          </button>
        </p>
      </motion.div>
    </div>
  );
}