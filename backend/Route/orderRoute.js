import express from "express";
const OrderRoutes = express.Router()
import {createOrder,verifyPayment} from "../controller/RazorPay.js"
import{order,updateorder,orderById,pendingOrder,shippedOrder,completedOrder,orderupdatestatus} from "../controller/ordercontroller.js"
// import orders from "razorpay/dist/types/orders.js";


OrderRoutes.post('/payement',createOrder)
OrderRoutes.post('/payement/verification',verifyPayment)
OrderRoutes.post("/orders",order);
OrderRoutes.put('/orders/:orderId',updateorder );
OrderRoutes.get("/orders/:emailId", orderById);
OrderRoutes.get("/pending", pendingOrder);
OrderRoutes.get("/shipped", shippedOrder);
OrderRoutes.get("/comleted", completedOrder);
OrderRoutes.put('/order/:orderId/status',orderupdatestatus);


export default OrderRoutes;



