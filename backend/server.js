import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";

import prismaPkg from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const { PrismaClient } = prismaPkg;

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
  connectionLimit: 1,
  connectTimeout: 30000,
  acquireTimeout: 30000,
});

const prisma = new PrismaClient({ adapter });

// ================= RAZORPAY =================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// ================= HEALTH =================
app.get("/", (req, res) => {
  res.json({
    message: "Backend working",
    status: "OK",
  });
});

app.get("/api/debug-db", (req, res) => {
  res.json({
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    hasPassword: !!process.env.DB_PASSWORD,
  });
});

// ================= REGISTER WITH MOBILE =================
app.post("/api/register", async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        message: "Name, mobile number and password are required",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        message: "Enter valid 10 digit mobile number",
      });
    }

    const exists = await prisma.user.findUnique({
      where: { phone },
    });

    if (exists) {
      return res.status(400).json({
        message: "Mobile number already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (e) {
    console.error("REGISTER ERROR:", e);
    res.status(500).json({
      message: "Registration failed",
      error: e.message,
    });
  }
});

// ================= LOGIN WITH MOBILE =================
app.post("/api/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: "Mobile number and password required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid mobile number or password",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid mobile number or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    res.status(500).json({
      message: "Login failed",
      error: e.message,
    });
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
    res.status(500).json({
      message: "Error fetching stores",
      error: e.message,
    });
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
    res.status(500).json({
      message: "Error fetching store",
      error: e.message,
    });
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
        message: "Razorpay keys missing in environment variables",
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

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        message: "Razorpay secret missing in environment variables",
      });
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
    res.status(500).json({
      message: "Verification failed",
      error: err.message,
    });
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
            phone: true,
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
      "PAID",
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
    const phone = "9999999999";

    const exists = await prisma.user.findUnique({
      where: { phone },
    });

    if (exists) {
      return res.json({
        message: "Admin already exists",
        user: exists,
      });
    }

    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@med.com",
        phone,
        password: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
      },
    });

    res.json({
      message: "Admin created",
      admin,
    });
  } catch (error) {
    console.error("ADMIN CREATE ERROR:", error);
    res.status(500).json({
      message: "Admin creation failed",
      error: error.message,
    });
  }
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});