import mongoose, { Schema, Document } from "mongoose";

interface ISale extends Document {
  saleId: string; // Added field to match SaleID from CSV
  productId: string; // Matches ProductID from products table
  quantitySold: number;
  saleDate: Date;
  totalAmount: number;
}

const SaleSchema: Schema = new Schema({
  saleId: { type: String, required: true, unique: true },
  productId: { type: String, required: true }, // Matches ProductID from products table
  quantitySold: { type: Number, required: true },
  saleDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
});

const Sale = mongoose.model<ISale>("Sale", SaleSchema);
export { Sale, ISale };
