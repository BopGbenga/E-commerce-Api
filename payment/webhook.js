const handleWebhook = async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash === req.headers["x-paystack-signature"]) {
    const event = req.body;

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const orderId = event.data.metadata.orderId;

      // Mark order as paid in your database
      await OrderModel.findByIdAndUpdate(orderId, { status: "paid" });

      res.sendStatus(200);
    }
  }

  res.sendStatus(400);
};

module.exports = { handleWebhook };
