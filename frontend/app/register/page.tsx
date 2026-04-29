"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5000";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
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
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Create Account
        </h2>
        <p className="mb-5 text-sm text-gray-500">
          Register to start ordering medicines.
        </p>

        <input
          type="text"
          placeholder="Name"
          className="mb-3 w-full rounded-xl border border-gray-300 p-3 text-black outline-none focus:border-green-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded-xl border border-gray-300 p-3 text-black outline-none focus:border-green-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded-xl border border-gray-300 p-3 text-black outline-none focus:border-green-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={register}
          className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-semibold text-green-600"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}