const joi = require("joi");
const category = require("../models/category");
// Joi.objectId = require("joi-objectid")(Joi);

const valdateProduct = async (req, res, next) => {
  try {
    const productSchema = joi.object({
      name: joi.string().required(),
      description: joi.string().required(),
      richDescription: joi.string().required(),
      image: joi.string(),
      brand: joi.string().required(),
      price: joi.string().required(),
      category: joi.string(),
      countInStock: joi.string().required(),
      rating: joi.string().required(),
      numReviews: joi.string().required(),
      isFeatured: joi.string(),
    });
    await productSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.log(error);
    res.status(422).json({
      message: "An error occured",
      success: false,
    });
  }
};

module.exports = { valdateProduct };
