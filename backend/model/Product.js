import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    productImage: { type: String, required: true },
    price: { type: Number, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["men", "women"] },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
