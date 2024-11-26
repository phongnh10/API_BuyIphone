const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const category = require("./category");

const productSchema = new Schema({
  id: { type: ObjectId },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  describe: {
    type: String,
    required: true,
  },
  category: {
    type: ObjectId,
    ref: "category",
    required: true,
  },
});

module.exports =
  mongoose.models.product || mongoose.model("product", productSchema);
