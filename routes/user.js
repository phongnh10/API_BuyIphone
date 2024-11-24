const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Tạo user mới
router.post("/register", async (req, res) => {
  try {
    const { avatar, name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Tên, email và mật khẩu là bắt buộc." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email này đã được sử dụng. Vui lòng chọn email khác.",
      });
    }

    // Tạo người dùng mới
    const user = new User({ avatar, name, email, password, phone, address });
    await user.save();
    res.status(201).json({ message: "Tạo user thành công.", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
});

//Login
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res
        .status(400)
        .json({ status: false, message: "Sai tài khoản hoặc mật khẩu" });
    } else {
      return res.status(200).json({
        status: true,
        message: "Đăng nhập thành công",
        id: user._id,
      });
    }
  } catch (e) {
    res.status(400).json({ status: false, message: "error" });
  }
});
// Lấy danh sách user
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
});

// Lấy thông tin chi tiết user theo ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
});

// Cập nhật user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user." });
    }

    res.status(200).json({ message: "Cập nhật thành công.", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
});

// Xóa user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user." });
    }

    res.status(200).json({ message: "Xóa user thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
});

module.exports = router;
