const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const router = express.Router();

//get user
router.get("/", async (req, res) => {
  const userList = await User.find().select("-password");
  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(userList);
});
//get user by id
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(500).json({ message: "the user with the id is not found" });
  }
  res.status(200).send(user);
});

//post user
router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    address: req.body.address,
    isAdmin: req.body.isAdmin,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(404).send("the user cannot be created");

  res.send(user);
});

module.exports = router;
