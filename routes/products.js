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

module.exports = router;
