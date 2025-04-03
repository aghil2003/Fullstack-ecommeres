import express from "express";
const OrderRoutes = express.Router()
import {createOrder,verifyPayment} from "../controller/RazorPay.js"
import Order from "../model/Order.js"
// import orders from "razorpay/dist/types/orders.js";


OrderRoutes.post('/payement',createOrder)
OrderRoutes.post('/payement/verification',verifyPayment)
OrderRoutes.post("/orders", async (req, res) => {
    try {
        const { useremail,address, productId,quantity ,size,totalAmount, payment,status} = req.body;
        // Validate required fields
        if ( !useremail||!productId ||productId.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid order data" });
        }

        // Create new order
        const newOrder = new Order({
            useremail,
            address,
            productId,
            totalAmount,
            quantity,
            size,
            payment,
            status,
        });

        await newOrder.save();
        res.json({ success: true, message: "Order saved successfully!", order: newOrder });
    } catch (error) {
        console.error("Order save error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

OrderRoutes.get("/orders/:emailId", async (req, res) => {
    try {
        const { emailId } = req.params;
        
      
        const orders = await Order.find({ useremail: emailId });  
        console.log(orders);

        res.status(200).json(orders);  // Send the orders with populated product details
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
});

OrderRoutes.get("/pending", async (req, res) => {
    try {
        const pending = await Order.find({ status: "Pending" });
        console.log();
          // Added `await` to fetch data from DB
        res.status(200).json(pending); 
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
});
OrderRoutes.get("/shipped", async (req, res) => {
    try {
        const shipped = await Order.find({ status: "shipped" });
        console.log();
          // Added `await` to fetch data from DB
        res.status(200).json(shipped); 
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
});
OrderRoutes.get("/comleted", async (req, res) => {
    try {
        const shipped = await Order.find({ status: "completed" });
        console.log();
          // Added `await` to fetch data from DB
        res.status(200).json(shipped); 
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
});

OrderRoutes.put('/order/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    // Valid statuses
    const validStatuses = ["pending", "shipped", "completed"];

    // Check if the status is valid
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        // Find the order by ID and update the status
        const order = await Order.findByIdAndUpdate(
            orderId, 
            { status: status }, 
            { new: true } // Return the updated order
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
});


export default OrderRoutes;



