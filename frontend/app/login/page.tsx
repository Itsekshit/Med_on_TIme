"use client";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Login with OTP
        </h2>

        <p className="mb-5 text-sm text-gray-500">
          Enter your mobile number to continue.
        </p>

        <input
          type="tel"
          placeholder="Mobile Number"
          maxLength={10}
          disabled={otpSent}
          className="mb-3 w-full rounded-xl border border-gray-300 p-3 text-black outline-none focus:border-green-600 disabled:bg-gray-100"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
        />

        {otpSent && (
          <input
            type="tel"
            placeholder="Enter OTP"
            maxLength={6}
            className="mb-3 w-full rounded-xl border border-gray-300 p-3 text-black outline-none focus:border-green-600"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
        )}

        {!otpSent ? (
          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-green-400"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-green-400"
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
        )}

        {otpSent && (
          <button
            onClick={() => {
              setOtpSent(false);
              setOtp("");
            }}
            className="mt-3 w-full text-sm font-semibold text-green-600"
          >
            Change mobile number
          </button>
        )}

        <p className="mt-4 text-center text-xs text-gray-500">
          Demo OTP: <b>123456</b>
        </p>
      </div>
    </div>
  );
}