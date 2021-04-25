const express = require("express");
const adminController = require("../Controller/adminController");
const router = express.Router();

router.get("/", adminController.protect, adminController.admin);

module.exports = router;
