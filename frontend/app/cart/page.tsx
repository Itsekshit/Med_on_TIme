"use client";

import { useCart } from "@/app/context/CartContext";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#111827]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="text-xl font-extrabold text-green-600">
            Med On Time
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="mb-6 text-3xl font-extrabold">Your Cart</h2>

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <div className="mb-4 text-6xl">🛒</div>
            <h3 className="text-xl font-bold">Your cart is empty</h3>
            <p className="mt-2 text-gray-500">
              Add medicines from nearby stores.
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Browse Stores
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        From {item.storeName}
                      </p>
                      <p className="mt-2 text-lg font-bold text-green-600">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="rounded-full border border-gray-300 p-2 hover:bg-gray-50"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="rounded-full border border-gray-300 p-2 hover:bg-gray-50"
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4 text-right font-bold">
                    Item Total: ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-xl font-bold">Bill Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between">
                  <span>Medicine total</span>
                  <span>₹{totalPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-extrabold">
                    <span>Grand Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* ✅ FIXED BUTTON */}
              <button
                onClick={() => router.push("/checkout")}
                className="mt-6 w-full rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className="mt-3 w-full rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50"
              >
                Clear Cart
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}