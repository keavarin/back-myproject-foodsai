const { Customer } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      if (!token) return res.status(401).json({ message: "u r authorized" });
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const customer = await Customer.findOne({ where: { id: payload.id } });
      if (!customer) return res.status(400).json({ message: "user not found" });
      req.customer = customer;
      next();
    }
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const {
      email,
      phoneNumber,
      password,
      confirmPassword,
      firstName,
      lastName,
    } = req.body;
    if (password !== confirmPassword)
      return res.status(400).json({ message: "password not match!" });

    if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/))
      return res.status(400).json({
        message: `Password should at least one number, one lowercase and one uppercase letter at least six characters that are letters, numbers or the underscore`,
      });

    const hashedPassword = await bcrypt.hash(
      password,
      +process.env.BCRYPT_SALT
    );
    const customer = await Customer.create({
      email,
      firstName,
      lastName,
      phoneNumber,
      password: hashedPassword,
    });

    const payload = {
      id: customer.id,
      email,
      firstName,
      lastName,
      role: "customer",
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ token });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const customer = await Customer.findOne({ where: { email } });
    if (!customer)
      return res
        .status(400)
        .json({ message: "customer or password is not correct" });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "customer or password is not correct" });

    const payload = {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      role: "customer",
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};
exports.update = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      houseNumber,
      road,
      village,
      district,
      subDistrict,
      province,
      postalCode,
    } = req.body;

    await Customer.update(
      {
        firstName,
        lastName,
        phoneNumber,
        houseNumber,
        road,
        village,
        district,
        subDistrict,
        province,
        postalCode,
      },
      { where: { id: req.customer.id } }
    );
    res.status(200).json({ message: "update success" });
  } catch (err) {
    next(err);
  }
};
exports.changePassword = async (req, res, next) => {
  try {
    const { newPassword, password, confirmNewPassword } = req.body;

    if (password === undefined)
      return res.status(400).json({ message: "password is require" });
    if (newPassword === undefined)
      return res.status(400).json({ message: "newPassword is require" });
    if (confirmNewPassword === undefined)
      return res.status(400).json({ message: "confirmNewPassword is require" });

    const isPasswordMatch = await bcrypt.compare(
      password,
      req.customer.password
    );

    if (!isPasswordMatch)
      return res.status(400).json({ message: "oldPassword incorrect" });
    if (newPassword === password)
      return res
        .status(400)
        .json({ message: "password should not same oldPassword" });
    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ message: "password did not match" });

    if (!newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/))
      return res.status(400).json({
        message: `Password should at least one number,one lowercase and one uppercase letter at least six characters that are letters,numbers or the underscore`,
      });

    const hashedPassword = await bcrypt.hash(
      newPassword,
      +process.env.BCRYPT_SALT
    );

    req.customer.password = hashedPassword;
    await req.customer.save();
    res.status(200).json({ message: "password update success" });
  } catch (err) {
    next(err);
  }
};

exports.me = (req, res, next) => {
  const { id, firstName, lastName, email } = req.customer;
  res.status(200).json({
    user: {
      id,
      firstName,
      lastName,
      email,
    },
  });
};
