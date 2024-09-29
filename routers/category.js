const Category = require("../models/category");
const express = require("express");
const router = express.Router();

// get all
router.get("/", async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

//get by id
router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(500).json({ message: "the category with the id is not found" });
  }
  res.status(200).send(category);
});

//update
router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.name,
      colour: req.body.colour,
    },
    { new: true }
  );

  if (!category) return res.status(404).send("the category cannot be created");

  res.send(category);
});

//post
router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    colour: req.body.colour,
  });
  category = await category.save();

  if (!category) return res.status(404).send("the category cannot be created");

  res.send(category);
});

//delete
router.delete("/:id", (req, res) => {
  Category.findByIdAndDelete(req.params.id).then((category) => {
    if (category) {
      return res.status(200).json({
        sucess: true,
        message: "category deleted",
      });
    } else {
      return res
        .status(400)
        .jsone({
          success: false,
          message: "category not found",
        })
        .catch((err) => {
          return res.status(400).json({ success: false, error: err });
        });
    }
  });
});

module.exports = router;