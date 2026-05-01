"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Login() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!phone || !password) {
      alert("Please enter mobile number and password");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
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
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Login</h2>

        <p className="mb-5 text-sm text-gray-500">
          Login using your mobile number.
        </p>

        <input
          type="tel"
          placeholder="Mobile Number"
          maxLength={10}
          className="mb-3 w-full rounded-xl border border-gray-300 p-3 text-black outline-none focus:border-green-600"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded-xl border border-gray-300 p-3 text-black outline-none focus:border-green-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="font-semibold text-green-600"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}