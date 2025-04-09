// import mongoose from "mongoose";

// const OrderSchema = new mongoose.Schema({
//     useremail:{type:String,ref: "User", required: true},
//     address: {
//         fullName: String,
//         street: String,
//         city: String,
//         state: String,
//         zip: String,
//     },
//     productId: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',  
//         required: true
//       }],
//     quantity:{type:String},
//     size:{type:String},
//     totalAmount: {type:String},
//     payment: {
//         razorpay_order_id: String,
//         razorpay_payment_id: String,
//         razorpay_signature: String,
//     },
//     status: {
//         type: String,
//         enum: ["Pending", "Completed", "Failed"],
//         default: "Pending",
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     }
// });

// const Order = mongoose.model("Order", OrderSchema);

// export default Order;

import mongoose from "mongoose";

// Counter schema to store the last order number
const CounterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", CounterSchema);

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true }, // Add orderId field
    useremail: { type: String, ref: "User", required: true },
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
    quantity: { type: String },
    size: { type: String },
    totalAmount: { type: String },
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

// Pre-save hook to generate orderId
OrderSchema.pre("save", async function (next) {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { name: "orderId" },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );

        const paddedNumber = counter.value.toString().padStart(2, "0");
        this.orderId = `trentnext${paddedNumber}`;
    }
    next();
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
