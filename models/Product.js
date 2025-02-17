const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
  price: { type: Number, required: true, min: 0, default: 0 },
  discount: { type: Number, min: 0, max: 75, default: 0 },
  stock: { type: Number, min: 0, default: 0 },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  },
  { versionKey: false }
);
const Product = model("Product", categorySchema);
module.exports = Product;
