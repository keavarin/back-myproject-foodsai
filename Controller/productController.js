require("dotenv").config();
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { Product, sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

exports.bulkCreate = async (req, res, next) => {
  try {
    const { products } = req.body;

    for ({ name, price, status, imgUrl } of products) {
      if (!name || !name.trim())
        return res.status(400).json({ message: "name is require" });
      if (!price) return res.status(400).json({ message: "price is require" });
      if (!(+price > 0))
        return res
          .status(400)
          .json({ message: "price must numeric and greater than 0" });
    }
    await Product.bulkCreate(products);
    res.status(201).json({ message: "all product created" });
  } catch (err) {
    next(err);
  }
};

// app.post("/", upload.single("image"), async (req, res, next) => {
//   cloudinary.uploader.upload(req.file.path, async (err, result) => {
//     //ฝากไปอัพที่ cloudinary

//     const product = await Product.create({
//       name: req.body.name,
//       imgUrl: result.secure_url,
//     });
//     fs.unlinkSync(req.file.path); //ลบไฟล์รูปที่อยู่มนเครื่ืองเราไม่ให้ลบ
//     console.log(product);
//     res.status(200).json({ message: "img-upload", product });
//   });
// });

exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, status, imgUrl } = req.body;

    if (!name || !name.trim())
      return res.status(400).json({ message: "name is require" });
    if (!price) return res.status(400).json({ message: "price is require" });
    if (!(+price > 0))
      return res
        .status(400)
        .json({ message: "price must numeric and greater than 0" });

    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      console.log(req.file.path);
      const product = await Product.create({
        name,
        imgUrl: result.secure_url,
        status,
        price,
      });

      fs.unlinkSync(req.file.path);

      res.status(200).json({ message: "img-upload", product });
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, status } = req.body;

    if (!price) return res.status(400).json({ message: "price is require" });
    if (!(+price > 0))
      return res
        .status(400)
        .json({ message: "price must numeric and greater than 0" });

    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      await Product.update(
        {
          name,
          price,
          status,
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
