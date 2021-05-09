const { Admin } = require("../models");
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
      const admin = await Admin.findOne({ where: { id: payload.id } });
      if (!admin) return res.status(400).json({ message: "Admin Only" });
      req.admin = admin;
      next();
    }
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return res.status(400).json({ message: "password not match!" });

    const hashedPassword = await bcrypt.hash(
      password,
      +process.env.BCRYPT_SALT
    );
    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    const payload = { id: admin.id, email, role: "admin" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin)
      return res
        .status(400)
        .json({ message: "admin or password is not correct" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "admin or password is not correct" });

    const payload = { id: admin.id, email: admin.email, role: "admin" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.admin = (req, res, next) => {
  const { id, email } = req.admin;
  res.status(200).json({
    admin: {
      id,
      email,
    },
  });
};
