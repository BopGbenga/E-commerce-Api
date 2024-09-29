const productModel = require("../models/products");
const categoryModel = require("../models/category");

//getAllproducts
const getAllproducts = async (req, res) => {
  try {
    // Extract query parameters for searching
    const { name, category } = req.query;

    // Build query object dynamically based on search parameters
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Filter by category
    if (category) {
      const foundCategory = await categoryModel.findOne({ name: category });
      if (foundCategory) {
        query.category = foundCategory._id;
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid category" });
      }
    }
    // Fetch products based on the query
    const products = await productModel.find(query).populate("category");

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get by id
const getProductbyid = async (req, res) => {
  const product = await productModel
    .findById(req.params.id)
    .populate("category");

  if (!product) {
    res.status(500).json({ success: false, message: "product not found" });
  }
  res.send(product);
};

//post products
const createProduct = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ name: req.body.category });
    if (!category) return res.status(400).send("invalid category");
    const newProduct = new productModel({
      ...req.body,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//update product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runVaidators: true }
    );
    if (!updateProduct) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//delete product
const deleteProduct = async (req, res) => {
  try {
    const deleteProduct = await productModel.findByIdAndDelete(req.params.id);
    if (!deleteProduct) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllproducts,
  getProductbyid,
  createProduct,
  updateProduct,
  deleteProduct,
};
