"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

  useEffect(() => {
    const savedAddress = localStorage.getItem("savedAddress");
    const savedPincode = localStorage.getItem("savedPincode");
    const savedUser = localStorage.getItem("user");

    if (savedAddress) setAddress(savedAddress);
    if (savedPincode) setPincode(savedPincode);

    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user?.phone) setPhone(user.phone);
    }
  }, []);

  const saveAddressLocally = () => {
    localStorage.setItem("savedAddress", address);
    localStorage.setItem("savedPincode", pincode);
  };

  // ================= ONLINE PAYMENT =================
  const placeOrder = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return alert("Please login first");

    if (!address || !pincode || !phone) {
      return alert("Please fill all details");
    }

    if (cart.length === 0) {
      return alert("Cart is empty");
    }

    try {
      setPlacing(true);
      saveAddressLocally();

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        return alert("Razorpay failed to load");
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
        return alert(paymentData.message || "Payment failed");
      }

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Med On Time",
        order_id: paymentData.orderId,

        handler: async function (response: any) {
          await fetch(`${API_BASE_URL}/api/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });

          const storeId = cart[0].storeId;

          await fetch(`${API_BASE_URL}/api/orders`, {
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
              paymentMethod: "ONLINE",
            }),
          });

          clearCart();
          alert("Payment successful!");
          router.push("/orders");
        },

        prefill: {
          contact: phone,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      alert("Payment failed");
    } finally {
      setPlacing(false);
    }
  };

  // ================= CASH ON DELIVERY =================
  const placeCODOrder = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return alert("Please login first");

    if (!address || !pincode || !phone) {
      return alert("Please fill all details");
    }

    if (cart.length === 0) {
      return alert("Cart is empty");
    }

    try {
      setPlacing(true);
      saveAddressLocally();

      const storeId = cart[0].storeId;

      await fetch(`${API_BASE_URL}/api/orders`, {
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
          paymentMethod: "COD",
        }),
      });

      clearCart();
      alert("Order placed with Cash on Delivery!");
      router.push("/orders");
    } catch {
      alert("Order failed");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-extrabold">Checkout</h1>

        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="bg-white p-6 rounded-3xl shadow">
            <h2 className="mb-4 text-xl font-bold">Delivery Details</h2>

            <input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mb-3 w-full border p-3 rounded-xl"
            />

            <input
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="mb-3 w-full border p-3 rounded-xl"
            />

            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mb-3 w-full border p-3 rounded-xl"
            />

            {/* COD BUTTON */}
            <button
              onClick={placeCODOrder}
              className="mb-3 w-full border border-green-600 text-green-600 py-3 rounded-xl font-bold"
            >
              Cash on Delivery
            </button>

            {/* ONLINE BUTTON */}
            <button
              onClick={placeOrder}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold"
            >
              Pay & Place Order
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="mt-4 font-bold text-lg">
              Total: ₹{totalPrice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}