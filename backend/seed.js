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
    {
      name: "Apollo Pharmacy",
      image:
        "https://images.unsplash.com/photo-1580281657527-47e8d1cfa5c7",
    },
    {
      name: "MedPlus Pharmacy",
      image:
        "https://images.unsplash.com/photo-1576602976047-174e57a47881",
    },
    {
      name: "Wellness Forever",
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
    },
    {
      name: "Guardian Pharmacy",
      image:
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09",
    },
    {
      name: "Netmeds Store",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de",
    },
    {
      name: "HealthCare Medical",
      image:
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
    },
    {
      name: "LifeCare Pharmacy",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
    },
    {
      name: "CityMed Store",
      image:
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7",
    },
    {
      name: "CarePlus Pharmacy",
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
    },
    {
      name: "24x7 Medical Store",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
    },
  ];

  for (let i = 0; i < stores.length; i++) {
    await prisma.store.create({
      data: {
        name: stores[i].name,
        address: `Sector ${i + 1}, Greater Noida`,
        pincode: "201310",
        deliveryTime: 20 + i * 2,
        image: stores[i].image,

        products: {
          create: [
            {
              name: "Paracetamol 500mg",
              description: "Fever and pain relief",
              price: 30,
              category: "Fever",
              isAvailable: true,
            },
            {
              name: "Crocin Advance",
              description: "Pain and fever medicine",
              price: 40,
              category: "Fever",
              isAvailable: true,
            },
            {
              name: "Vitamin C Tablets",
              description: "Immunity booster",
              price: 120,
              category: "Vitamins",
              isAvailable: true,
            },
            {
              name: "Cough Syrup",
              description: "Cold and cough relief",
              price: 90,
              category: "Cold",
              isAvailable: true,
            },
            {
              name: "Zinc Tablets",
              description: "Immunity support",
              price: 95,
              category: "Vitamins",
              isAvailable: true,
            },
            {
              name: "ORS Powder",
              description: "Hydration support",
              price: 20,
              category: "Healthcare",
              isAvailable: true,
            },
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