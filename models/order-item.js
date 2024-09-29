const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
});

const orderItemModel = mongoose.model("OrderItem", orderItemSchema);

module.exports = orderItemModel;
