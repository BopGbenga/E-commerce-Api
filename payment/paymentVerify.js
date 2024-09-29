const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

const verifyPayment = async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await paystack.transaction.verify(reference);

    if (response.data.status === "success") {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: response.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { verifyPayment };
