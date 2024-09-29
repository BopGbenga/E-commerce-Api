const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("dotenv").config();

// Configure nodemailer transporter
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
    console.log("User created:", newUser);

    // Create email verification token
    const verificationToken = jwt.sign(
      { _id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Create verification link
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/verify-email?token=${verificationToken}`;

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: newUser.email,
      subject: "Verify Your Email",
      html: `<p>Hello ${newUser.firstname},</p>
             <p>Thank you for registering! Please verify your email by clicking on the link below:</p>
             <a href="${verificationLink}">Verify Email</a>`,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          message: "Error sending verification email",
          success: false,
        });
      }
      console.log("Verification email sent:", info.response);
    });

    // Respond to client
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
  console.log("Password from request:", logInfo.password);
  // Check if the user has verified their email
  if (user.isVerified === false) {
    return res.status(403).json({
      message: "Please verify your email to login",
      success: false,
    });
  }

  // const validPassword = await user.isValidPassword(logInfo.password);
  const validPassword = await user.isValidPassword(logInfo.password.trim());

  console.log("Password from request:", logInfo.password);
  console.log("Stored hashed password:", user.password);
  console.log("Password validation result:", validPassword);
  if (!validPassword) {
    return res.status(422).json({
      message: "Email or password is incorrect",
    });
  }

  const token = jwt.sign(
    { _id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.status(200).json({
    message: "Login successful",
    success: true,
    token,
  });
};

module.exports = { createUser, verifyEmail, login };
