const express = require("express");
const paymentController = require("./paymentController");
const paymentVerify = require("./paymentVerify");

const router = express.Router();

router.post("/init", paymentController.initializePayment);
router.get("/verify/:reference", paymentVerify.verifyPayment);

module.exports = router;
