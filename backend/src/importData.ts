import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { Product, IProduct, ISale, Sale } from "./models"; // Ensure the correct import path

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://mahdi:hfWAMOG4alrvrbUZ@cluster0.cqgpl.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
    // Start importing products and sales data after successful connection
    importProducts();
    importSales();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Function to parse and insert products
const importProducts = () => {
  const products: IProduct[] = [];

  fs.createReadStream(path.join(__dirname, "./data/products.csv"))
    .pipe(csv())
    .on("data", (data) => {
      // Create a new Product instance and push it to the array
      const product = new Product({
        productId: data.ProductID,
        name: data.ProductName,
        category: data.Category,
        price: parseFloat(data.Price), // Ensure the price is a number
      });

      products.push(product);
    })
    .on("end", async () => {
      try {
        // Insert all products into MongoDB
        await Product.insertMany(products);
        console.log("Products imported successfully");
      } catch (err) {
        console.error("Error importing products:", err);
      }
    });
};

// Function to parse and insert sales data
const importSales = () => {
  const sales: ISale[] = [];

  fs.createReadStream(path.join(__dirname, "./data/sales.csv"))
    .pipe(csv())
    .on("data", (data) => {
      // Create a new Sale instance and push it to the array
      const sale = new Sale({
        saleId: data.SaleID,
        productId: data.ProductID, // Assuming ProductID is a reference in the Sale model
        quantitySold: parseInt(data.Quantity),
        saleDate: new Date(data.Date),
        totalAmount: parseFloat(data.TotalAmount),
      });

      sales.push(sale);
    })
    .on("end", async () => {
      try {
        // Insert all sales into MongoDB
        await Sale.insertMany(sales);
        console.log("Sales imported successfully");
      } catch (err) {
        console.error("Error importing sales:", err);
      }
    });
};
