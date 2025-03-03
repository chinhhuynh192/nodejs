const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, min: 0, max: 90, default: 0 },
    stock: { type: Number, min: 0, default: 0 },
    // Reference to Category
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Reference to Supplier
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
  },
  { versionKey: false }
);

productSchema.virtual("total").get(function () {
  return (this.price * (100 - this.discount)) / 100;
});
// Virtual with Populate
productSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});
productSchema.virtual("supplier", {
  ref: "Supplier",
  localField: "supplierId",
  foreignField: "_id",
  justOne: true,
});
// Config
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });
//aplly plugin
productSchema.plugin(mongooseLeanVirtuals);

const Product = model("Product", productSchema);
module.exports = Product;
