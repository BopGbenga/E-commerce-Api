const category = require("../models/category");
const categoryModel = require("../models/category");

//get all
const getAllCategory = async (req, res) => {
  try {
    const categoryList = await categoryModel.find();
    if (!categoryList || categoryList.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: " Category not found" });
    }
    res.status(200).send(categoryList);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get by id
const getcategorybyid = async (req, res) => {
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    res.status(500).json({ success: false, message: "category not found" });
  }
  res.send(category);
};

//post category
const createCategory = async (req, res) => {
  try {
    const newcategory = new categoryModel(req.body);
    const savedcategory = await newcategory.save();
    res.status(201).json(savedcategory);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//update category
const updatecategory = async (req, res) => {
  try {
    const updatedcategory = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runVaidators: true }
    );
    if (!updatecategory) {
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    }
    res.status(200).json(updatedcategory);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//delete category
const deletecategory = async (req, res) => {
  try {
    const deletecategory = await categoryModel.findByIdAndDelete(req.params.id);
    if (!deletecategory) {
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCategory,
  getcategorybyid,
  createCategory,
  updatecategory,
  deletecategory,
};
