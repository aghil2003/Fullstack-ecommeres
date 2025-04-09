import Order from "../model/Order.js"

export const order=async (req, res) => {
    try {
        const { useremail,address, productId,quantity ,size,totalAmount, payment,status} = req.body;
        if ( !useremail||!productId ||productId.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid order data" });
        }
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
}


export const updateorder=async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderstatus, paymentDetails } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { 
                orderstatus,
                paymentDetails
            },
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        return res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error("Error updating order:", error);
        return res.status(500).json({ success: false, message: "Error updating order" });
    }
}

export const orderById=async (req, res) => {
    try {
        const { emailId } = req.params;
        
      
        const orders = await Order.find({ useremail: emailId, orderstatus: "Completed" } );  
        console.log(orders);

        res.status(200).json(orders);  
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
}

export const pendingOrder=async (req, res) => {
    try {
        const pending = await Order.find({ status: "Pending" });
        console.log();
        res.status(200).json(pending); 
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
}

export const shippedOrder=async (req, res) => {
    try {
        const shipped = await Order.find({ status: "shipped" });
        console.log();
        res.status(200).json(shipped); 
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
}

export const completedOrder=async (req, res) => {
    try {
        const shipped = await Order.find({ status: "completed" });
        console.log();
        res.status(200).json(shipped); 
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
}


export const orderupdatestatus=async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "shipped", "completed"];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const order = await Order.findByIdAndUpdate(
            orderId, 
            { status: status }, 
            { new: true } 
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
}