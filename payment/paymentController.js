const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY); // Paystack SDK
const OrderModel = require("../models/order");

const initializePayment = async (req, res) => {
  try {
    const { email, amount, orderId } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const totalAmount = amount * 100;

    // Initialize payment with Paystack
    const response = await paystack.transaction.initialize({
      email, // Customer email
      amount: totalAmount, // Amount in kobo
      callback_url: "http://your-domain.com/paystack/callback",
      metadata: {
        orderId: order._id,
      },
    });

    res.status(200).json({
      success: true,
      authorization_url: response.data.authorization_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { initializePayment };
