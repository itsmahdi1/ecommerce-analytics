import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
    productId: string; // Added field to match ProductID from CSV
    name: string;
    category: string;
    price: number;
  }

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);
export { Product, IProduct };
