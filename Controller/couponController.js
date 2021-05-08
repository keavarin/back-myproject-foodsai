const { Coupon } = require("../models");
require("dotenv").config();
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
let voucher_codes = require("voucher-code-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function createCode(num) {
  num = `${+num + 1}`;
  num = num.padStart(5, "0");
  return num;
}
// let myCode = voucher_codes.generate({
//   prefix: "SAI",
//   charset: "0123456789",
// });
// console.log(myCode);
// exports.createCoupon = async (req, res, next) => {
//   try {
//     let couponCode = await Coupon.max("code"); //หาค่าmaxในcolummn code
//     console.log(couponCode);
//     let num;
//     if (!couponCode) {
//       num = "";
//     } else {
//       num = couponCode.slice(3);
//       console.log(num);
//     }

//     let genCode = "SAI" + createCode(num);

//     const coupon = await Coupon.create({
//       discount: 0.1,
//       code: myCode[0],
//     });

//     res.status(201).json({ coupon });
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// };
exports.createCoupon = async (req, res, next) => {
  try {
    const { code, discount } = req.body;

    if (!code || !code.trim())
      return res.status(400).json({ message: "code is require" });
    if (!discount)
      return res.status(400).json({ message: "discount is require" });

    const coupon = await Coupon.create({
      code,
      discount,
    });
    res.status(201).json({ coupon });
  } catch (err) {
    next(err);
  }
};

// exports.updateProduct = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { name, price, status } = req.body;

//     if (!price) return res.status(400).json({ message: "price is require" });
//     if (!(+price > 0))
//       return res
//         .status(400)
//         .json({ message: "price must numeric and greater than 0" });

//     cloudinary.uploader.upload(req.file.path, async (err, result) => {
//       await Product.update(
//         {
//           name,
//           price,
//           status,
//           imgUrl: result.secure_url,
//         },
//         { where: { id } }
//       );
//       fs.unlinkSync(req.file.path);
//     });

//     res.status(200).json({ message: "update success" });
//   } catch (err) {
//     next(err);
//   }
// };

exports.statusCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, discount } = req.body;
    // if (!code)
    //   return res.status(400).json({ message: "Please input discount" });
    // if (!discount)
    //   return res.status(400).json({ message: "Please input discount" });

    await Coupon.update({ status: "FALSE" }, { where: { id } });
    res.status(201).json({ message: "Update  Success" });
  } catch (err) {
    next(err);
  }
};

exports.getCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({
      where: { status: "TRUE" },
      order: [["id", "DESC"]],
    });
    res.status(200).json({ coupon });
  } catch (err) {
    next(err);
  }
};

// exports.updateCoupon = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { status, discount } = req.body;

//     cloudinary.uploader.upload(req.file.path, async (err, result) => {
//       await Product.update(
//         {
//           status,
//           discount,
//           imgUrl: result.secure_url,
//         },
//         { where: { id } }
//       );
//       fs.unlinkSync(req.file.path);
//     });

//     res.status(200).json({ message: "update success" });
//   } catch (err) {
//     next(err);
//   }
// };
