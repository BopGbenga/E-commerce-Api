const express = require("express");
const middleware = require("./productMiddleware");
const controller = require("./productControllers");
const tokenAuth = require("../auth");

const router = express.Router();

router.get("/", controller.getAllproducts);
router.get("/:id", controller.getProductbyid);
router.post(
  "/",
  tokenAuth.bearTokenAuth,
  tokenAuth.isAdmin,
  middleware.valdateProduct,
  controller.createProduct
);
router.put(
  "/:id",
  tokenAuth.bearTokenAuth,
  tokenAuth.isAdmin,
  controller.updateProduct
);
router.delete(
  "/:id",
  tokenAuth.bearTokenAuth,
  tokenAuth.isAdmin,
  controller.deleteProduct
);

module.exports = router;
