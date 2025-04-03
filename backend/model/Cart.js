import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  size: { type: String, required: true },
  quantity: { type: Number, default: 0 }
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;
