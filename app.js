var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// Mongoose và kết nối cơ sở dữ liệu
const mongoose = require("mongoose");
require("dotenv").config();

// Tải models
require("./models/user");
require("./models/category");

// Thư viện axios và node-cron
const axios = require("axios");
const cron = require("node-cron");

// Import router
var userRouter = require("./routes/user");
var categoryRouter = require("./routes/category");

var app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Kết nối MongoDB
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://phongnh10:G3JPLpKxkWLJrudJ@api-phongnh10.cla57.mongodb.net/BuyIphone",
    {}
  )
  .then(() => console.log(">>>>>>>>>> DB Connected!!!!!!"))
  .catch((err) => console.log(">>>>>>>>> DB Error: ", err));

// Tạo cron job mỗi 10 phút
cron.schedule("*/10 * * * *", async () => {
  try {
    const response = await axios.get(
      "https://api-buyiphone.onrender.com/category"
    );
    console.log("Cron job gọi server thành công!", response.status);
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi server:", error.message);
  }
});

// Định nghĩa các route
app.use("/user", userRouter);
app.use("/category", categoryRouter);

// Cấu hình port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Xử lý lỗi 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Bộ xử lý lỗi chung
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.send("Có lỗi xảy ra: " + err.message);
});

module.exports = app;
