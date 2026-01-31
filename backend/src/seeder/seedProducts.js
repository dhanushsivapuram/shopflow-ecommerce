import dotenv from "dotenv";
import fetch from "node-fetch";
import Product from "../models/Product.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedProducts = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing existing products...");
    await Product.deleteMany();

    console.log("🌐 Fetching products from DummyJSON...");

    // Change limit to 100, 200, 300, 500 as you like (max 1000)
    const LIMIT = 500;

    const res = await fetch(
      `https://dummyjson.com/products?limit=${LIMIT}`
    );
    const data = await res.json();

    const products = data.products.map((item) => ({
      name: item.title,
      description: item.description,
      price: Math.round(item.price * 80), // USD → INR approx
      image: item.thumbnail,
      stock: item.stock,
      category: item.category
    }));

    await Product.insertMany(products);

    console.log(`✅ ${products.length} DummyJSON products seeded successfully`);
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed", error);
    process.exit(1);
  }
};

seedProducts();
