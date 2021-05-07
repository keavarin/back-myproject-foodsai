const { Coupon } = require("../models");
require("dotenv").config();
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
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
    if (!status)
      return res.status(400).json({ message: "Please input status" });

    await Coupon.update({ status, discount }, { where: { code: id } });
    res.status(201).json({ message: "Change Status Success" });
  } catch (err) {
    next(err);
  }
};

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

exports.updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, discount } = req.body;

    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      await Product.update(
        {
          status,
          discount,
          imgUrl: result.secure_url,
        },
        { where: { id } }
      );
      fs.unlinkSync(req.file.path);
    });

    res.status(200).json({ message: "update success" });
  } catch (err) {
    next(err);
  }
};
