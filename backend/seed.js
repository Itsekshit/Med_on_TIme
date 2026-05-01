import "dotenv/config";
import prismaPkg from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const { PrismaClient } = prismaPkg;

const adapter = new PrismaMariaDb({
  host: "switchback.proxy.rlwy.net",
  port: 29750,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "railway",
  connectionLimit: 1,
  connectTimeout: 30000,
  acquireTimeout: 30000,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Med On Time data...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();

  const stores = [
    "Apollo Pharmacy",
    "MedPlus Pharmacy",
    "Wellness Forever",
    "Guardian Pharmacy",
    "Netmeds Store",
    "HealthCare Medical",
    "LifeCare Pharmacy",
    "CityMed Store",
    "CarePlus Pharmacy",
    "24x7 Medical Store",
  ];

  for (let i = 0; i < stores.length; i++) {
    await prisma.store.create({
      data: {
        name: stores[i],
        address: `Sector ${i + 1}, Greater Noida`,
        pincode: "201310",
        deliveryTime: 20 + i * 2,
        products: {
          create: [
            { name: "Paracetamol 500mg", description: "Fever and pain relief", price: 30, category: "Fever", isAvailable: true },
            { name: "Crocin Advance", description: "Pain and fever medicine", price: 40, category: "Fever", isAvailable: true },
            { name: "Vitamin C Tablets", description: "Immunity booster", price: 120, category: "Vitamins", isAvailable: true },
            { name: "Cough Syrup", description: "Cold and cough relief", price: 90, category: "Cold", isAvailable: true },
            { name: "Zinc Tablets", description: "Immunity support", price: 95, category: "Vitamins", isAvailable: true },
            { name: "ORS Powder", description: "Hydration support", price: 20, category: "Healthcare", isAvailable: true },
          ],
        },
      },
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });