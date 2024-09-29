const joi = require("joi");

const validateCategory = async (req, res, next) => {
  try {
    const categorySchema = joi.object({
      name: joi.string().required(),
      icon: joi.string().required(),
      colour: joi.string().required(),
    });
    await categorySchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.log(error);
    res.status(422).json({
      message: "An error occured",
      successs: false,
    });
  }
};

module.exports = { validateCategory };
