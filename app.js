require("dotenv").config();

const cors = require("cors");
const express = require("express");
const multer = require("multer");
const errorMiddleware = require("./Middleware/error");
const app = express();

const adminController = require("./Controller/adminController");
const customerController = require("./Controller/customerController");
const customerRoute = require("./Routes/customerRoute");
const productRoute = require("./Routes/productRoute");
const couponRoute = require("./Routes/couponRoute");
const paymentRoute = require("./Routes/paymentRoute");
const orderRoute = require("./Routes/orderRoute");
const adminRoute = require("./Routes/adminRoute");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, "public/images"); //ตัวแรกคือ err ให้มันเปน null ,
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + file.mimetype.split("/")[1]);
    //ตั้งชื่อ file image เพื่อให้ดูดี
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.split("/")[1] === "jpg" ||
      file.mimetype.split("/")[1] === "jpeg" ||
      file.mimetype.split("/")[1] === "png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("This file is not a photo"));
    }
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/product", upload.single("imgUrl"), productRoute);

app.use("/coupon", couponRoute);
app.use("/customer", customerRoute);
app.use("/payment", paymentRoute);
app.use("/order", orderRoute);
app.use("/admin", adminRoute);

app.post("/register", customerController.register);
app.post("/registeradmin", adminController.register);

app.post("/login", customerController.login);
app.post("/loginadmin", adminController.login);

app.use((req, res, next) => {
  res.status(404).json({ message: "page not found" });
});

app.use(errorMiddleware);

//sequelize.sync({force: true}).then(()=> console.log('DB Synce'))

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on ${port}`));
