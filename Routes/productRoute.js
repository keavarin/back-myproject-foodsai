const express = require("express");
const productController = require("../Controller/productController");
const adminController = require("../Controller/adminController");
const customerController = require("../Controller/adminController");

const router = express.Router();

router.post("/bulkproduct", productController.bulkCreate);

router.put(
  "/updateproduct/:id",
  adminController.protect,
  productController.updateProduct
);
router.post(
  "/createproduct",
  adminController.protect,

  productController.createProduct
);
router.get("/", productController.getAllProduct);

module.exports = router;
