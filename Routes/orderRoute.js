const express = require("express");
const orderController = require("../Controller/orderController");
const customerController = require("../Controller/customerController");
const adminController = require("../Controller/adminController");

const router = express.Router();

router.get(
  "/customer",
  customerController.protect,
  orderController.getAllOrdersById
);
router.get("/:id", orderController.getOrder);
router.get("/", adminController.protect, orderController.getAllOrders);

router.post("/", customerController.protect, orderController.createOrder);
router.put("/statusorder/:id", orderController.statusOrder);
router.delete(
  "/deleteorder/:id",
  adminController.protect,
  orderController.deleteOrder
);

module.exports = router;
