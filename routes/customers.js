const express = require("express");
const router = express.Router();
const { Customer } = require("../models");

// Methods: POST / PATCH / GET / DELETE / PUT
// Get all
router.get("/", async (req, res, next) => {
  try {
    let results = await Customer.find();
    res.json(results);
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
});

// Create new data
router.post("/", async function (req, res, next) {
  // Mongoose
  try {
    const data = req.body;
    const newItem = new Customer(data);
    let result = await newItem.save();

    return res.send({ ok: true, message: "Created", result });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
//4a. Hiển thị tất cả các khách hàng có địa chỉ ở Quận Hải Châu
router.get("/4a", async (req, res, next) => {
  try {
    const text = "Danang";
    const query = { address: new RegExp(`${text}`) };
    let results = await Customer.find(query);
    res.send(results);
  } catch (err) {
    res.sendStatus(500);
  }
});
//4b. Hiển thị tất cả các khách hàng có địa chỉ ở Quận Hải Châu
router.get("/4b", async (req, res, next) => {
  try {
    const text = req.query.address;
    const query = { address: new RegExp(`${text}`) };
    let results = await Customer.find(query);
    res.send(results);
  } catch (err) {
    res.sendStatus(500);
  }
});
//5a. Hiển thị tất cả các khách hàng có năm sinh 1990
router.get("/5a", async (req, res, next) => {
  try {
    const query = {
      $expr: {
        $eq: [{ $year: "$birthday" }, 1990],
      },
    };
    let results = await Customer.find(query);
    res.send(results);
  } catch (err) {
    res.sendStatus(500);
  }
});
//5b. Hiển thị tất cả các khách hàng có năm sinh X
router.get("/5b", async (req, res, next) => {
  try {
    const year = parseInt(req.query.year);
    const query = {
      $expr: {
        $eq: [{ $year: "$birthday" }, year],
      },
    };
    let results = await Customer.find(query);
    res.send(results);
  } catch (err) {
    res.sendStatus(500);
  }
});
//6a. Hiển thị tất cả các khách hàng có sinh nhật là hôm nay
router.get("/6a", async (req, res, next) => {
  try {
    const today = new Date();
    console.log(today);
    const eqDay = {
      $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: today }],
    };
    const eqMonth = {
      $expr: {
        $eq: [{ $month: "$birthday" }, { $month: today }],
      },
    };
    const query = {
      $expr: {
        $and: [eqDay, eqMonth],
      },
    };
    let results = await Customer.find(query);
    res.send(results);
  } catch (err) {
    res.sendStatus(500);
  }
});
//6a. Hiển thị tất cả các khách hàng có sinh nhật là X
router.get("/6b", async (req, res, next) => {
  try {
    const birthday = new Date(
      1990,
      parseInt(req.query.birthdayMonth) - 1,
      parseInt(req.query.birthdayDay) + 1
    );
    console.log(birthday);

    const eqDay = {
      $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: birthday }],
    };
    const eqMonth = {
      $expr: {
        $eq: [{ $month: "$birthday" }, { $month: birthday }],
      },
    };
    const query = {
      $expr: {
        $and: [eqDay, eqMonth],
      },
    };
    let results = await Customer.find(query);
    res.send(results);
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;
