const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Create a new user
const createUser = async (req, res) => {
  try {
    const userInfo = req.body;

    // Check if the user exists
    const existingUser = await userModel.findOne({ email: userInfo.email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    // Create new user
    const newUser = await userModel.create(userInfo);

    // Create email verification token
    const verificationToken = jwt.sign(
      { _id: newUser._id, email: newUser.email },
      process.env.JWt_SECRET,
      { expiresIn: "8h" }
    );

    // Create verification link
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/verify-email?token=${verificationToken}`;

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME, // sender address
      to: newUser.email, // user's email address
      subject: "Verify Your Email", // Subject line
      html: `<p>Hello ${newUser.firstname},</p>
             <p>Thank you for registering! Please verify your email by clicking on the link below:</p>
             <a href="${verificationLink}">Verify Email</a>`, // HTML body
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
    }

    res.status(201).json({
      message: "User created successfully, verification email sent",
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// Verify email endpoint
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWt_SECRET);

    // Find the user and update their verification status
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// User login
const login = async (req, res) => {
  const logInfo = req.body;

  const user = await userModel.findOne({ email: logInfo.email });
  if (!user) {
    return res.status(409).json({
      message: "User not found",
      success: false,
    });
  }

  // Check if the user has verified their email
  if (user.isVerified === false) {
    return res.status(403).json({
      message: "Please verify your email to login",
      success: false,
    });
  }

  const validPassword = await user.isValidPassword(logInfo.password);
  if (!validPassword) {
    return res.status(422).json({
      message: "Email or password is incorrect",
    });
  }

  const token = jwt.sign(
    { _id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWt_SECRET,
    { expiresIn: "8h" }
  );

  return res.status(200).json({
    message: "Login successful",
    success: true,
    token,
  });
};

module.exports = { createUser, verifyEmail, login };
