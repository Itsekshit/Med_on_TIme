"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 p-10 rounded-2xl w-full max-w-md border border-gray-800"
      >

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-blue-500 mb-2">
          Create Account 🚀
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Register to start ordering medicines
        </p>

        {/* NAME */}
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 text-white"
        />

        {/* PHONE */}
        <input
          type="text"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 text-white"
        />

        {/* BUTTON */}
        <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg transition">
          Register
        </button>

        {/* BACK TO LOGIN */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-blue-500 hover:underline cursor-pointer">
              Login
            </span>
          </Link>
        </p>

      </motion.div>
    </div>
  );
}