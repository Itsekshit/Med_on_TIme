"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_BASE_URL = "http://localhost:5000";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();

  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [placing, setPlacing] = useState(false);

  const placeOrder = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    if (!address || !pincode || !phone) {
      alert("Please fill all details");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      router.push("/");
      return;
    }

    try {
      setPlacing(true);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert("Razorpay failed to load");
        return;
      }

      const paymentRes = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalPrice }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        alert(paymentData.message || "Payment order failed");
        return;
      }

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Med On Time",
        description: "Medicine Order Payment",
        order_id: paymentData.orderId,

        handler: async function (response: any) {
          const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok) {
            alert(verifyData.message || "Payment verification failed");
            return;
          }

          const storeId = cart[0].storeId;

          const orderRes = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: Number(userId),
              storeId,
              items: cart,
              totalAmount: totalPrice,
              address,
              pincode,
              phone,
            }),
          });

          const orderData = await orderRes.json();

          if (!orderRes.ok) {
            alert(orderData.message || "Order failed after payment");
            return;
          }

          clearCart();
          alert("Payment successful. Order placed!");
          router.push("/orders");
        },

        prefill: {
          contact: phone,
        },

        theme: {
          color: "#16a34a",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-10 text-[#111827]">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-extrabold">Checkout</h1>

        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold">Delivery Details</h2>

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

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mb-3 w-full rounded-xl border p-3 text-black outline-none"
            />

            <button
              onClick={placeOrder}
              disabled={placing}
              className="mt-3 w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700 disabled:bg-green-400"
            >
              {placing ? "Processing Payment..." : "Pay & Place Order"}
            </button>
          </div>

          <div className="h-fit rounded-3xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

            {cart.map((item) => (
              <div
                key={item.id}
                className="mb-3 flex justify-between border-b pb-2 text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="mt-4 flex justify-between text-lg font-extrabold">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}