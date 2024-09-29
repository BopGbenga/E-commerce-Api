const jwt = require("jsonwebtoken");

const userModel = require("./models/user");

require("dotenv").config();

// Token check middlware
const bearTokenAuth = async (req, res, next) => {
  try {
    const autHeader = req.headers.authorization;
    if (!autHeader) {
      return res.status(401).json({
        message: "you are not authorized",
      });
    }
    const token = await autHeader.split(" ")[1];

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        message: " User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "unauthorized",
    });
  }
};

//Admin check middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is admin, proceed
  } else {
    return res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }
};

module.exports = { bearTokenAuth, isAdmin };
