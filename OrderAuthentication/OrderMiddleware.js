const joi = require("joi");

const validatOrder = async (req, res, next) => {
  try {
    const orderSchema = joi.object({
      // orderItems: joi.string().required(),
      orderItems: joi
        .array()
        .items(
          joi.object({
            product: joi.string().required(), // Assuming product is a string (ObjectId)
            quantity: joi.number().required(),
          })
        )
        .required(),
      shippingAddress: joi.string().required(),
      city: joi.string().required(),
      country: joi.string().required(),
      phone: joi.number().required(),
      status: joi.string(),
      user: joi.string(),
      totalPrice: joi.string(),
    });
    await orderSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.log(error);
    res.status(422).json({
      message: "An error occured",
      success: false,
    });
  }
};
module.exports = { validatOrder };
