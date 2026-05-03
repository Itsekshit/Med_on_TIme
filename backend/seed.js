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
      image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg",
    },
    {
      name: "MedPlus Pharmacy",
      image: "https://images.pexels.com/photos/4047186/pexels-photo-4047186.jpeg",
    },
    {
      name: "Wellness Forever",
      image: "https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg",
    },
    {
      name: "Guardian Pharmacy",
      image: "https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg",
    },
    {
      name: "Netmeds Store",
      image: "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg",
    },
    {
      name: "HealthCare Medical",
      image: "https://images.pexels.com/photos/7088526/pexels-photo-7088526.jpeg",
    },
    {
      name: "LifeCare Pharmacy",
      image: "https://images.pexels.com/photos/5938358/pexels-photo-5938358.jpeg",
    },
    {
      name: "CityMed Store",
      image: "https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg",
    },
    {
      name: "CarePlus Pharmacy",
      image: "https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg",
    },
    {
      name: "24x7 Medical Store",
      image: "https://images.pexels.com/photos/4226264/pexels-photo-4226264.jpeg",
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