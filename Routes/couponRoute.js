const express = require("express");
const couponController = require("../Controller/couponController");
const adminController = require("../Controller/adminController");
const customerController = require("../Controller/customerController");
const router = express.Router();

router.get("/", couponController.getCoupon);
router.put("/statuscoupon/:id", couponController.statusCoupon);
router.post("/createcoupon", couponController.createCoupon);
module.exports = router;
