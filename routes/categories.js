var express = require("express");
var router = express.Router();
const { default: mongoose } = require("mongoose");
const { Category } = require("../models");

mongoose.connect("mongodb://localhost:27017/online-shop");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({
    message: "API",
  });
});

router.post("/", function (req, res, next) {
  //todo: add a new category
  const data = req.body;
  const newCategory = new Category(data);
  newCategory
    .save()
    .then((result) => {
      newCategory.save().then((result) => {
        res.json(result);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

module.exports = router;
