const express = require('express');
const paymentController = require('../Controller/paymentController');
const adminController = require('../Controller/adminController');
const customerController = require('../Controller/customerController');
const router = express.Router();


router.put('/statuspayment/:id',adminController.protect, paymentController.statusPayment)
router.post('/createpayment',customerController.protect,paymentController.createPayment)
module.exports = router;