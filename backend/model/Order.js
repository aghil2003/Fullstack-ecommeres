import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    useremail:{type:String,ref: "User", required: true},
    address: {
        fullName: String,
        street: String,
        city: String,
        state: String,
        zip: String,
    },
    productId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',  
        required: true
      }],
    quantity:{type:String},
    size:{type:String},
    totalAmount: {type:String},
    payment: {
        razorpay_order_id: String,
        razorpay_payment_id: String,
        razorpay_signature: String,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;