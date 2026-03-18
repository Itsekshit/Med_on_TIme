"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import StoreList from "./components/StoreList";

export default function Home() {

  const [pincode, setPincode] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked(true);

    if (pincode === "201310") {
      setIsValid(true);

      // smooth scroll to store section
      setTimeout(() => {
        document.getElementById("stores")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);

    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white min-h-screen">

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full bg-black/70 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center">
          
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500">
            MED ON TIME
          </h1>

          <Link href="/login">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-5 py-2 rounded-lg transition hover:scale-105 text-sm sm:text-base">
              Login
            </button>
          </Link>

        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight"
          >
            Medicines Delivered <br />
            <span className="text-blue-500">In 30 Minutes</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-gray-400 text-base sm:text-lg md:text-xl"
          >
            Fast, secure and trusted medicine delivery from nearby pharmacies.
          </motion.p>

          {/* PINCODE INPUT */}
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3">

            <input
              type="text"
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
                setChecked(false); // reset when typing
              }}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 w-full sm:w-auto"
            />

            <button
              onClick={handleCheck}
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Check
            </button>

          </div>

          {/* ERROR MESSAGE (ONLY AFTER CLICK) */}
          {checked && !isValid && (
            <div className="mt-4 bg-red-900/30 border border-red-500 p-3 rounded-lg text-center">
              ❌ Service not available in your area  
              <br />
              <span className="text-sm text-gray-400">
                Currently available only in Greater Noida (201310)
              </span>
            </div>
          )}

        {checked && isValid && pincode === "201310" && (
  <Link href="/cart">
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-3 rounded-xl text-base sm:text-lg transition"
    >
      Order Now
    </motion.button>
  </Link>
)}
        </div>
      </section>

      {/* STORE SECTION */}
      <section id="stores" className="py-16 px-4 sm:px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-500 mb-10">
            Nearby Pharmacies
          </h2>

          {/* SHOW STORES ONLY AFTER VALID CHECK */}
          {checked && isValid && pincode === "201310" && (
            <StoreList pincode={pincode} isValid={isValid} />
          )}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center border-t border-gray-800 text-gray-500 text-sm sm:text-base">
        © 2026 Med On Time
      </footer>

    </div>
  );
}