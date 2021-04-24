const {
  Order,
  Product,
  OrderItem,
  Customer,
  sequelize,
  Coupon,
} = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const e = require("express");

function createOrderTracking(num) {
  num = `${+num + 1}`;
  num = num.padStart(3, "0");
  return num;
}

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: {
            model: Product,
            attributes: ["id", "name"],
          },
        },
      ],
    });
    res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};
exports.getAllOrdersById = async (req, res, next) => {
  try {
    // const id= req.customer.id;
    const order = await Order.findAll({
      where: { customerId: req.customer.id },

      include: [
        {
          model: Customer,
          attributes: ["firstName", "lastName", "email"],
        },

        {
          model: OrderItem,
          attributes: ["id", "amount", "price"],
          include: { model: Product, attributes: ["id", "name"] },
        },
      ],
    });
    res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};
exports.getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      where: { orderTracking: id },

      include: [
        {
          model: Customer,
          attributes: ["firstName", "lastName", "email"],
        },

        {
          model: OrderItem,
          attributes: ["id", "amount", "price"],
          include: { model: Product, attributes: ["id", "name"] },
        },
      ],
    });
    if (!order) return res.status(400).json({ message: "order is require" });
    if (order.orderTracking === null)
      return res.status(400).json({ message: "orderTracking is null" });

    res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      status,
      paymentId,
      couponId,
      phoneNumberToOrder,
      houseNumberToOrder,
      roadToOrder,
      districtToOrder,
      subDistrictToOrder,
      provinceToOrder,
      postalCodeToOrder,
      villageToOrder,
      items,
    } = req.body;

    let orderTrack = await Order.max("orderTracking");

    let num;
    if (!orderTrack) {
      num = "";
    } else {
      num = orderTrack;
    }

    let orderTracking = createOrderTracking(num);

    let x;
    let coupon;

    if (!couponId) {
      x = 0;
    } else {
      coupon = await Coupon.findByPk(couponId);
      console.log(coupon.discount);
      if (coupon.discount != 0) {
        x = coupon.discount;
      } else if (coupon.discount === null) {
        x = 0;
      }
    }
    // console.log(`x${x}`);
    // if (coupon === null)
    //console.log(coupon);
    const orders = await Order.create(
      {
        date: new Date(),
        status,
        customerId: req.customer.id,
        paymentId,
        couponId,
        // discount,
        discount: x,
        houseNumberToOrder,
        phoneNumberToOrder,
        roadToOrder,
        districtToOrder,
        subDistrictToOrder,
        provinceToOrder,
        postalCodeToOrder,
        villageToOrder,
        orderTracking,
        //totalPrice: product.price*orderItems.amount
      },
      { transaction }
    );

    //console.log(orders.id)
    //console.log(req.customer.id)
    console.log(`orders.discount ${orders.discount}`);
    // console.log(coupon.discount);

    const orderItems = [];
    let sumPrice = 0;
    for (let item of items) {
      const product = await Product.findByPk(item.productId);
      //   console.log(item.id);
      const orderItem = await OrderItem.create(
        {
          productId: item.productId,
          orderId: orders.id,
          amount: item.amount,
          price: product.price,
        },
        { transaction }
      );

      orderItems.push(orderItem);

      if (couponId) {
        if (orders.discount === null || orders.discount === undefined) {
          sumPrice += product.price * +item.amount;
        }
        sumPrice += product.price * +item.amount * (1 - orders.discount);
      } else {
        sumPrice += product.price * +item.amount;
      }
    }

    await transaction.commit();

    await Order.update(
      { TotalPrice: sumPrice },
      {
        where: {
          id: orders.id,
        },
      }
    );
    console.log(orders.discount);
    res.status(201).json({ orders, orderItems });
  } catch (err) {
    //console.log(err);
    await transaction.rollback();
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    // await OrderItem.destroy({ where: { orderId:  } }, { transaction });
    await Order.destroy({ where: { orderTracking: id } }, { transaction });

    await transaction.commit();
    res.status(201).json({ message: "delete success" });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};
exports.statusOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status)
      return res.status(400).json({ message: "Please input status" });

    await Order.update({ status }, { where: { orderTracking: id } });
    res.status(201).json({ message: "Change Status Success" });
  } catch (err) {
    next(err);
  }
};

exports.test = async (req, res, next) => {
  try {
    await Order.update(
      { TotalPrice: 999 },
      {
        where: {
          provinceToOrder: "bkk",
        },
      }
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};
