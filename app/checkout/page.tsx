"use client";

import { useEffect, useState } from "react";

export default function Checkout() {
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);

    const sum = savedCart.reduce(
      (acc: number, item: any) => acc + item.price,
      0
    );

    setTotal(sum);
  }, []);

  const handlePayment = () => {
    alert("Payment Successful 🎉");

    localStorage.removeItem("cart");
    window.location.href = "/";
  };

  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold mb-5">Checkout 💳</h2>

      {cart.map((item, index) => (
        <p key={index}>
          {item.name} - ₹{item.price}
        </p>
      ))}

      <h3 className="mt-5 text-xl">
        Total: ₹{total}
      </h3>

      <button
        onClick={handlePayment}
        className="mt-5 bg-green-600 px-5 py-2 rounded"
      >
        Pay Now ✅
      </button>
    </div>
  );
}