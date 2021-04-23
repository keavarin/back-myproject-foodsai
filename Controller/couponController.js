const { Coupon } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function createCode(num) {
  num = `${+num + 1}`;
  num = num.padStart(5, "0");
  return num;
}

exports.createCoupon = async (req, res, next) => {
  try {
    let couponCode = await Coupon.max("code"); //หาค่าmaxในcolummn code
    console.log(couponCode);
    let num;
    if (!couponCode) {
      num = "";
    } else {
      num = couponCode.slice(3);
      console.log(num);
    }

    let genCode = "SAI" + createCode(num);

    // if (!code) return res.status(400).json({ message: "Please input code" });
    // if (!discount)
    //   return res.status(400).json({ message: "Please input discount" });

    const coupon = await Coupon.create({
      discount: 0.1,
      code: genCode,
    });

    res.status(201).json({ coupon });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.statusCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status)
      return res.status(400).json({ message: "Please input status" });

    await Coupon.update({ status }, { where: { id } });
    res.status(201).json({ message: "Change Status Success" });
  } catch (err) {
    next(err);
  }
};

// function getCode() {
//             let code = Math.floor(Math.random() * (10 - 1) + 1);
//             return code;
//         }
// console.log(getCode())
exports.getCoupon = async (req, res, next) => {
  try {
    //const hashedPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT)
    // const admin = await admin.create({
    //     email,
    //     password: hashedPassword
    // });
    // const payload = {id: admin.id, email}
    // const token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: +process.env.JWT_EXPIRES_IN} )
    // res.status(201).json({token})
  } catch (err) {
    next(err);
  }
};
