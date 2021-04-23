const express = require("express");
const couponController = require("../Controller/couponController");
const adminController = require("../Controller/adminController");
const customerController = require("../Controller/customerController");
const router = express.Router();

//router.put('/',customerController.protect, customerController.update)

router.get("/", customerController.protect, couponController.getCoupon);
router.put(
  "/statuscoupon/:id",
  adminController.protect,
  couponController.statusCoupon
);
router.get("/createcoupon", couponController.createCoupon);
module.exports = router;
