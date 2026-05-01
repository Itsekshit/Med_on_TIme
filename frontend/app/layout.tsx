import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import PageWrapper from "./components/PageWrapper";

export const metadata: Metadata = {
  title: "Med On Time",
  description: "Medicine delivery app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f7f8fc] text-[#111827]">
        <CartProvider>
          {/* 🔥 PAGE TRANSITION */}
          <PageWrapper>{children}</PageWrapper>

          {/* 🔥 GLOBAL TOAST */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              style: {
                borderRadius: "10px",
                background: "#111827",
                color: "#fff",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}