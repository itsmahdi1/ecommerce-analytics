import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { Product, Sale } from "./models";

const CHUNK_SIZE = 1000; // Number of records per chunk

// Function to import products
const importProducts = async () => {
  const products: any[] = [];
  let count = 0;

  fs.createReadStream(path.join(__dirname, "./data/products.csv"))
    .pipe(csv())
    .on("data", (data) => {
      products.push({
        productId: data.ProductID,
        name: data.ProductName,
        category: data.Category,
        price: parseFloat(data.Price),
      });

      // Insert in chunks
      if (products.length >= CHUNK_SIZE) {
        insertProducts(products);
        products.length = 0; // Clear the array
      }
    })
    .on("end", async () => {
      if (products.length > 0) {
        await insertProducts(products);
      }
      console.log("Products imported successfully");
    });
};

// Helper function for product insertion
const insertProducts = async (products: any[]) => {
  try {
    await Product.insertMany(products, { ordered: false });
  } catch (err) {
    console.error("Error inserting products:", (err as Error).message);
  }
};

// Function to import sales
const importSales = async () => {
  const sales: any[] = [];
  let count = 0;

  fs.createReadStream(path.join(__dirname, "./data/sales.csv"))
    .pipe(csv())
    .on("data", (data) => {
      sales.push({
        saleId: data.SaleID,
        productId: data.ProductID,
        quantitySold: parseInt(data.Quantity),
        saleDate: new Date(data.Date),
        totalAmount: parseFloat(data.TotalAmount),
      });

      // Insert in chunks
      if (sales.length >= CHUNK_SIZE) {
        insertSales(sales);
        sales.length = 0; // Clear the array
      }
    })
    .on("end", async () => {
      if (sales.length > 0) {
        await insertSales(sales);
      }
      console.log("Sales imported successfully");
    });
};

// Helper function for sales insertion
const insertSales = async (sales: any[]) => {
  try {
    await Sale.insertMany(sales, { ordered: false });
  } catch (err) {
    console.error("Error inserting sales:", (err as Error).message);
  }
};

// Call the import functions
mongoose
  .connect("mongodb+srv://mahdi:hfWAMOG4alrvrbUZ@cluster0.cqgpl.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
    importProducts();
    importSales();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
