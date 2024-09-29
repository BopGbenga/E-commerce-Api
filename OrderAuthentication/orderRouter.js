const express = require("express");
const controller = require("./orderController");
const middleware = require("./OrderMiddleware");
const auth = require("../auth");

const router = express.Router();

router.get("/", auth.bearTokenAuth, controller.getAllOrders);
router.get("/:id", controller.getOrderbyid);
router.post(
  "/",
  middleware.validatOrder,
  auth.bearTokenAuth,
  controller.createOrder
);
router.put("/:id", auth.bearTokenAuth, controller.updateorder);
router.delete("/:id", auth.bearTokenAuth, controller.deleteOrder);

module.exports = router;
