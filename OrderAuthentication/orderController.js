const { populate } = require("dotenv");
const OrderModel = require("../models/order");
const orderItemModel = require("../models/order-item");
const multer = require("multer");

//Get order
const getAllOrders = async (req, res) => {
  try {
    const orderList = await OrderModel.find()
      .populate("user", "email")
      .sort({ dateOrdered: -1 });
    // console.log(orderList);
    if (!orderList) {
      return res.status(500).json({ success: false });
    }
    res.send(orderList);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//get Order by id
const getOrderbyid = async (req, res) => {
  const order = await OrderModel.findById(req.params.id)
    .populate("user", "firstname") // Populating user with only the firstname field
    .populate({
      path: "orderItems", // Populating orderItems
      populate: {
        path: "product", // Populating the product field within orderItems
        model: "products", // Ensure this matches your actual Product model name
      },
    });

  if (!order) {
    res.status(500).json({ success: false, message: "order not found" });
  }
  res.send(order);
};

//post order
const createOrder = async (req, res) => {
  try {
    const orderItemsIds = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new orderItemModel({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });
        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
      })
    );
    const orderItemIdResvoled = await orderItemsIds;

    const totalPrices = await Promise.all(
      orderItemIdResvoled.map(async (orderItemsId) => {
        const orderItem = await orderItemModel
          .findById(orderItemsId)
          .populate("product", "price");

        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalOrderPrice = totalPrices.reduce((acc, price) => acc + price, 0);

    const newOrder = new OrderModel({
      ...req.body,
      orderItems: orderItemsIds,
      totalPrice: totalOrderPrice,
      user: req.user._id,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//update order
const updateorder = async (req, res) => {
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runVaidators: true }
    );
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Delete Order
const deleteOrder = async (req, res) => {
  try {
    const order = await OrderModel.findByIdAndDelete(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Deleting associated order items
    await Promise.all(
      order.orderItems.map(async (orderItem) => {
        await orderItemModel.findByIdAndDelete(orderItem);
      })
    );

    return res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderbyid,
  createOrder,
  updateorder,
  deleteOrder,
};
