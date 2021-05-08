const {
  Order,
  Product,
  OrderItem,
  Customer,
  sequelize,
  Coupon,
} = require("../models");

function createOrderTracking(num) {
  num = `${+num + 1}`;
  num = num.padStart(3, "0");
  return num;
}

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      attributes: [
        "id",
        "status",
        "phoneNumberToOrder",
        "customerId",
        "paymentId",
      ],
      order: [["id", "DESC"]],
      // limit: 100,
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
      where: { id },

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
    console.log(order);
    if (!order)
      return res.status(400).json({ message: "ไม่มีเลขที่ orderนี้" });
    if (order === null)
      return res.status(400).json({ message: "ไม่มีเลขที่ orderนี้" });
    if (order.id === undefined)
      return res.status(400).json({ message: "id is null" });
    if (order.id === "") return res.status(400).json({ message: "id is null" });

    res.status(200).json({ order /* coupon*/ });
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

    let discountRate;
    let coupon;

    if (!couponId) {
      discountRate = 0;
    } else {
      coupon = await Coupon.findByPk(couponId);
      console.log("coupon", coupon);
      console.log(coupon.discount);
      if (coupon.discount != 0) {
        discountRate = coupon.discount;
      } else if (coupon.discount === null) {
        discountRate = 0;
      }
    }
    console.log(`discountRate${discountRate}`);
    // if (coupon === null)
    //console.log(coupon);
    const orders = await Order.create(
      {
        date: new Date(),
        status,
        customerId: req.customer.id,
        paymentId,
        couponId,
        discount: discountRate,
        houseNumberToOrder,
        phoneNumberToOrder,
        roadToOrder,
        districtToOrder,
        subDistrictToOrder,
        provinceToOrder,
        postalCodeToOrder,
        villageToOrder,
      },
      { transaction }
    );
    console.log(couponId);
    console.log(orders.id);

    console.log(`orders.discount ${orders.discount}`);

    const orderItems = [];
    let sumPrice = 0;
    for (let item of items) {
      const product = await Product.findByPk(item.productId);

      const orderItem = await OrderItem.create(
        {
          productId: item.productId,
          orderId: orders.id,
          amount: item.amount,
          price: product.price,
        },
        { transaction }
      );
      console.log("order-id", orders.id);
      console.log("sai", orderItem.orderId);

      orderItems.push(orderItem);
      console.log("item-price", orderItem.price);
      console.log(couponId);

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

    res.status(201).json({ orders, orderItems, coupon });
  } catch (err) {
    console.log(err);
    await transaction.rollback();
    console.error(err.message);
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    await Order.destroy({ where: { id } }, { transaction });

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

    await Order.update({ status }, { where: { id } });
    res.status(201).json({ message: "Change Status Success" });
  } catch (err) {
    next(err);
  }
};
