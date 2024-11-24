const express = require("express");
const router = express.Router();
const Category = require("../models/category");

// Tạo danh mục mới
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc." });
    }

    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: "Tạo danh mục thành công.", category });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
});

// Lấy danh sách danh mục
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
});

// Cập nhật danh mục
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc." });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }

    res.status(200).json({ message: "Cập nhật thành công.", category });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
});

// Xóa danh mục
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }

    res.status(200).json({ message: "Xóa danh mục thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server.", error: error.message });
  }
});

module.exports = router;
