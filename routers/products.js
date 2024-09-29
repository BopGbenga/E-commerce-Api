const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const Category = require("../models/category");
const mongoose = require("mongoose");

//get by id
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});
//post product
router.post("/", async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid category");
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  const savedProduct = await product.save();

  if (!savedProduct)
    return res.status(500).send("The product cannot be created");
  res.send(savedProduct);
});
//update
router.put("/:id", async (req, res) => {
  try {
    // Validate the category
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid category");

    // Update the product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true } // Returns the updated document
    );

    // Handle case where product is not found
    if (!product)
      return res
        .status(404)
        .send("The product with the given ID was not found");

    // Send the updated product
    res.send(product);
  } catch (error) {
    // Handle any errors
    res.status(500).send("An error occurred: " + error.message);
  }
});

//Delete
router.delete("/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id).then((product) => {
    if (product) {
      return res.status(200).json({
        sucess: true,
        message: "product deleted",
      });
    } else {
      return res
        .status(400)
        .jsone({
          success: false,
          message: "product not found",
        })
        .catch((err) => {
          return res.status(400).json({ success: false, error: err });
        });
    }
  });
});

// router.get("/get/count", async (req, res) => {
//   const productCount = await Product.countDocuments((count) => count);
//   if (!productCount) {
//     res.status(500).json({ success: false });
//   }
//   res.send({
//     productCount: productCount,
//   });
// });

//get count
router.get("/get/count", async (req, res) => {
  try {
    // Await the promise returned by countDocuments()
    const productCount = await Product.countDocuments();

    // Respond with the count
    res.send({
      productCount: productCount,
    });
  } catch (error) {
    // Handle any errors
    res
      .status(500)
      .json({ success: false, message: "An error occurred: " + error.message });
  }
});
router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(count);
  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

module.exports = router;
