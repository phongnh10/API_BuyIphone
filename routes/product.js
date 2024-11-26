const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

// Thêm sản phẩm mới
router.post("/addProduct", async (req, res) => {
  try {
    const { name, image, price, describe, category } = req.body;

    if (!name || !image || !price || !describe || !category) {
      return res.status(400).json({
        status: false,
        message: "Vui lòng cung cấp đầy đủ thông tin sản phẩm!",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        status: false,
        message: "Category không hợp lệ!",
      });
    }

    const newProduct = new Product({
      name,
      image,
      price,
      describe,
      category,
    });

    await newProduct.save();

    res.status(201).json({
      status: true,
      message: "Sản phẩm đã được thêm thành công!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({
      status: false,
      message: "Lỗi server khi thêm sản phẩm!",
      error: error.message,
    });
  }
});

// Lấy danh sách tất cả sản phẩm
router.get("/getproducts", async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");

    res.status(200).json({
      status: true,
      message: "Lấy danh sách sản phẩm thành công!",
      products: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      status: false,
      message: "Lỗi server khi lấy danh sách sản phẩm!",
      error: error.message,
    });
  }
});

// Lấy products theo idcategory
router.get("/products/:idcategory", async (req, res) => {
  try {
    const { idcategory } = req.params;

    const products = await Product.find({ category: idcategory });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phầm nào có id loại như vậy" });
    }

    return res.status(200).json({
      status: true,
      message: "Lấy danh sách sản phẩm thành công!",
      products: products,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

module.exports = router;
