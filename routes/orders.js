const yup = require("yup");
const express = require("express");
const router = express.Router();
const { Order } = require("../models");
const ObjectId = require("mongodb").ObjectId;

// Get all
router.get("/", async (req, res, next) => {
  try {
    let results = await Order.find()
      .populate("customer")
      .populate("employee")
      .populate("orderDetails.product");
    res.json(results);
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
});
router.post("/", async function (req, res, next) {
  // Mongoose
  try {
    const data = req.body;
    const newItem = new Order(data);
    let result = await newItem.save();

    return res.send({ ok: true, message: "Created", result });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
//patch

router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;

    let found = await Order.findByIdAndUpdate(id, data, { new: true });

    if (found) {
      return res.json(found);
    }

    return res.sendStatus(404);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    let found = await Order.findByIdAndDelete(id);

    if (found) {
      return res.json(found);
    }

    return res.sendStatus(410);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
module.exports = router;
