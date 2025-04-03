import dotenv from 'dotenv';
import Razorpay from "razorpay";
import crypto from 'crypto'
dotenv.config()

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

 export const createOrder=async(req, res)=> {
  const { amount, currency } = req.body;
  try {
    const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_${Date.now()}`,
      };
      
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

 export const verifyPayment=async(req, res)=> {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const key_secret = process.env.RAZORPAY_SECRET_KEY;

  const hmac = crypto.createHmac("sha256", key_secret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === razorpay_signature) {
    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
}

// module.exports = {
//   createOrder,
//   verifyPayment
// };