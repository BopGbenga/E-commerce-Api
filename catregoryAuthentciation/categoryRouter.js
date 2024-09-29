const express = require("express");
const middleware = require("./categoryMiddleware");
const controller = require("./categoryController");
const tokenAuth = require("../auth");

const router = express.Router();

router.get("/", tokenAuth.bearTokenAuth, controller.getAllCategory);
router.get("/:id", controller.getcategorybyid);
router.post(
  "/",
  tokenAuth.bearTokenAuth,
  middleware.validateCategory,
  controller.createCategory
);
router.put("/:id", tokenAuth.bearTokenAuth, controller.updatecategory);
router.delete("/:id", tokenAuth.bearTokenAuth, controller.deletecategory);

module.exports = router;
