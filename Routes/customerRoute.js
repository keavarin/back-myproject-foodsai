const express = require("express");
const customerController = require("../Controller/customerController");

const router = express.Router();

router.get("/me", customerController.protect, customerController.me);
router.put("/", customerController.protect, customerController.update);
router.put(
  "/changepassword",
  customerController.protect,
  customerController.changePassword
);

module.exports = router;
