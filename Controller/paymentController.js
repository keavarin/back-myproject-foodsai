const { Payment, Order } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createPayment = async (req, res, next) => {
  try {
    const { paymentType, orderId } = req.body;

    const order = await Order.findByPk(orderId);
    // console.log(order.id);

    const payment = await Payment.create({
      paymentType: paymentType,
    });
    // console.log(payment.id);
    await Order.update(
      {
        paymentId: payment.id ? payment.id : null,
      },
      { where: { id: order.id } }
    );

    res.status(201).json({ payment });
  } catch (err) {
    next(err);
  }
};

exports.statusPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status)
      return res.status(400).json({ message: "Please input status" });

    await Payment.update({ status }, { where: { id } });
    res.status(201).json({ message: "update Status Success" });
  } catch (err) {
    next(err);
  }
};
