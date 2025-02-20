var express = require("express");
var router = express.Router();
const { default: mongoose } = require("mongoose");
const { Product } = require("../models");
mongoose.connect("mongodb://localhost:27017/online-shop");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post("/", function (req, res, next) {
  //todo: add a new Product to database
  const data = req.body;
  const newItem = new Product(data);

  newItem
    .save()
    .then((result) => {
      newItem.save().then((result) => {
        res.json(result);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

module.exports = router;
