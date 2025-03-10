const yup = require("yup");
var express = require("express");
var router = express.Router();
const { Product } = require("../models");
const ObjectId = require("mongodb").ObjectId;

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    let result = await Product.find()
      .populate("category")
      .populate("supplier")
      .lean({ virtuals: true });
    res.send(result);
  } catch (err) {
    res.sendStatus(500);
  }
});
router.post("/", async function (req, res, next) {
  // Validate
  const validationSchema = yup.object({
    body: yup.object({
      name: yup.string().required(),
      price: yup.number().positive().required(),
      discount: yup.number().min(0).max(50).required().default(0),
      stock: yup.number().min(0).default(0),
      // categoryId: yup
      //   .string()
      //   .required()
      //   .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
      //     return ObjectId.isValid(value);
      //   }),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      try {
        const data = req.body;
        const newItem = new Product(data);
        let result = await newItem.save();

        return res.send(result);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ type: err.name, errors: err.errors, provider: "yup" });
    });
});
//QUERY
//1a. Hiển thị tất cả các mặt hàng có giảm giá <= 10%
router.get("/questions/1a", async (req, res) => {
  try {
    let query = { discount: { $gte: 10 } };
    let result = await Product.find(query);
    res.send(result);
  } catch (err) {
    res.sendStatus(500);
  }
});
//1b. Hiển thị tất cả các mặt hàng có giảm giá <= 10%,
// và chi tiết danh mục, nhà cung cấp
router.get("/questions/1b", async (req, res) => {
  try {
    let query = { discount: { $gte: 10 } };
    let result = await Product.find(query)
      .populate("category")
      .populate("supplier")
      .lean({ virtuals: true });
    res.send(result);
  } catch (err) {
    res.sendStatus(500);
  }
});
//1c. Hiển thị tất cả các mặt hàng có giảm giá <= n,
// và chi tiết danh mục, nhà cung cấp
router.get("/questions/1c", async (req, res) => {
  try {
    let discount = req.query.discount;
    let query = { discount: { $gte: discount } };
    let result = await Product.find(query)
      .populate("category")
      .populate("supplier")
      .lean({ virtuals: true });
    res.send(result);
  } catch (err) {
    res.sendStatus(500);
  }
});
//1D.Hiển thị tất cả các mặt hàng có tồn kho <= 5,
// và chi tiết danh mục, nhà cung cấp
router.get("/questions/1d", async (req, res) => {
  try {
    let query = { stock: { $gte: 10 } };
    let result = await Product.find(query)
      .populate("category")
      .populate("supplier")
      .lean({ virtuals: true });
    res.send(result);
  } catch (err) {
    res.sendStatus(500);
  }
});
//3a. Hiển thị tất cả các mặt hàng có
// Giá bán sau khi đã tính giảm giá <= 1000
router.get("/questions/3a", async (req, res) => {
  try {
    // let finalPrice = price * (100 - discount) / 100;
    const s = { $subtract: [100, "$discount"] };
    const m = { $multiply: ["$price", s] };
    const d = { $divide: [m, 100] };
    let query = { $expr: { $lte: [d, parseFloat(1000)] } };
    let result = await Product.find(query);
    res.send(result);
  } catch (err) {
    res.sendStatus(500);
  }
});
//3b.Hiển thị tất cả các mặt hàng có
// Giá bán sau khi đã tính giảm giá <= n
// http://localhost:9000/products/questions/3?price=100000
router.get("/questions/3b", async (req, res) => {
  try {
    // let finalPrice = price * (100 - discount) / 100;
    let price = req.query.price;
    const s = { $subtract: [100, "$discount"] };
    const m = { $multiply: ["$price", s] };
    const d = { $divide: [m, 100] };
    let query = { $expr: { $lte: [d, parseFloat(price)] } };
    let result = await Product.find(query);
    res.send(result);
  } catch (err) {
    res.sendStatus(500);
  }
});
module.exports = router;
