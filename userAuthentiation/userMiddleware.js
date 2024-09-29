const joi = require("joi");

const validateUser = async (req, res, next) => {
  try {
    const userSchema = joi.object({
      firstname: joi.string().required(),
      lastname: joi.string().required(),
      password: joi.string().required(),
      email: joi.string().email().required(),
      phone: joi.number().required(),
      address: joi.string().required(),
      city: joi.string().required(),
      country: joi.string().required(),
      isAdmin: joi.boolean().required(),
    });
    await userSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.log(error);
    res.status(422).json({
      message: "user not created",
      success: false,
    });
  }
};

const loginValidate = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(422).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = { validateUser, loginValidate };
