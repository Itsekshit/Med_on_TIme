import "./globals.css";
import { Poppins } from "next/font/google";
import { CartProvider } from "./context/CartContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-black text-white`}>
        
        {/* ✅ GLOBAL CART WRAPPER */}
        <CartProvider>
          {children}
        </CartProvider>

      </body>
    </html>
  );
}