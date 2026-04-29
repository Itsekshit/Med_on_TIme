import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// ================= PRISMA =================
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const prisma = new PrismaClient({ adapter });

// ================= RAZORPAY =================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());

// ================= HEALTH =================
app.get("/", (req, res) => {
  res.json({ message: "Backend working" });
});

// ================= REGISTER =================
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error("REGISTER ERROR:", e);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ================= LOGIN =================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    res.status(500).json({ message: "Login failed" });
  }
});

// ================= SERVICEABILITY =================
app.get("/api/serviceability/:pincode", (req, res) => {
  const { pincode } = req.params;

  if (pincode === "201310") {
    return res.json({
      serviceable: true,
      message: "Delivery available in your area",
    });
  }

  return res.json({
    serviceable: false,
    message: "Delivery not available in your area",
  });
});

// ================= STORES =================
app.get("/api/stores", async (req, res) => {
  try {
    const { pincode } = req.query;

    const stores = await prisma.store.findMany({
      where: pincode ? { pincode: String(pincode) } : {},
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ stores });
  } catch (e) {
    console.error("STORES ERROR:", e);
    res.status(500).json({ message: "Error fetching stores" });
  }
});

// ================= STORE DETAILS =================
app.get("/api/stores/:id", async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        products: {
          where: {
            isAvailable: true,
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.json({ store });
  } catch (e) {
    console.error("STORE DETAILS ERROR:", e);
    res.status(500).json({ message: "Error fetching store" });
  }
});

// ================= MEDICINE SEARCH =================
app.get("/api/medicines", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();

    const medicines = await prisma.product.findMany({
      where: {
        isAvailable: true,
        ...(search && {
          name: {
            contains: search,
          },
        }),
      },
      include: {
        store: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ medicines });
  } catch (e) {
    console.error("MEDICINE SEARCH ERROR:", e);
    res.status(500).json({
      message: "Medicine search failed",
      error: e.message,
    });
  }
});

// ================= CREATE RAZORPAY ORDER =================
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount required" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        message: "Razorpay keys missing in .env",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error);

    res.status(500).json({
      message: "Payment order creation failed",
      error: error.message,
      description: error?.error?.description,
    });
  }
});

// ================= VERIFY RAZORPAY PAYMENT =================
app.post("/api/payment/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (err) {
    console.error("PAYMENT VERIFY ERROR:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

// ================= CREATE ORDER =================
app.post("/api/orders", async (req, res) => {
  try {
    const { userId, storeId, items, totalAmount, address, pincode, phone } =
      req.body;

    if (!userId || !storeId || !items?.length || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await prisma.order.create({
      data: {
        userId: Number(userId),
        storeId: Number(storeId),
        totalAmount: Number(totalAmount),
        deliveryAddress: String(address),
        pincode: String(pincode || ""),
        phone: String(phone || ""),
        status: "PAID",
        items: {
          create: items.map((item) => ({
            productId: Number(item.id),
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        },
      },
      include: {
        store: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({
      message: "Order placed successfully",
      order,
    });
  } catch (e) {
    console.error("ORDER ERROR:", e);
    res.status(500).json({
      message: "Order failed",
      error: e.message,
    });
  }
});

// ================= GET USER ORDERS =================
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        store: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ orders });
  } catch (error) {
    console.error("FETCH ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});
// ================= ADMIN: GET ALL ORDERS =================
app.get("/api/admin/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ orders });
  } catch (error) {
    console.error("ADMIN FETCH ORDERS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
});

// ================= ADMIN: UPDATE ORDER STATUS =================
app.patch("/api/admin/orders/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = Number(req.params.orderId);

    const allowedStatuses = [
      "PENDING",
      "ACCEPTED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
      include: {
        user: true,
        store: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("ORDER STATUS UPDATE ERROR:", error);
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});
// ================= DEV CREATE ADMIN =================
app.get("/api/dev/create-admin", async (req, res) => {
  try {
    const email = "admin@med.com";

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.json({ message: "Admin already exists", user: exists });
    }

    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email,
        password: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
      },
    });

    res.json({ message: "Admin created", admin });
  } catch (error) {
    console.error("ADMIN CREATE ERROR:", error);
    res.status(500).json({ message: "Admin creation failed" });
  }
});
// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});