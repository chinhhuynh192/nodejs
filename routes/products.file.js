var express = require("express");
var router = express.Router();
var data = require("../data/products.json");
var { write } = require("../helpers/fileHelper");

const fileName = "./data/products.json";
//CRUD

/* GET all products listing. */
router.get("/", function (req, res, next) {
  res.send(data);
});
// GET by id
router.get("/:id", function (req, res, next) {
  const id = req.params.id;
  const found = data.find((x) => x.id == id);
  if (!found) {
    return res.sendStatus(410);
  }
  res.send(found);
});

// POST new product
router.post("/", function (req, res, next) {
  const body = req.body;
  data.push(body);
  write(fileName, data);
  res.send("add new product");
});
//DELETE
router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  let found = data.find((x) => x.id == id);
  if (!found) {
    return res.sendStatus(410);
  }
  let remain = data.filter((x) => x.id != id);
  write(fileName, remain);

  return res.send("deleted");
});
//update by id
router.patch("/:id", function (req, res, next) {
  const id = req.params.id;
  const body = req.body;

  let found = data.find((x) => x.id == id);
  if (!found) {
    return res.sendStatus(410);
  }
  for (const key in body) {
    found[key] = body[key];
  }
  write(fileName, data);

  return res.send();
});

module.exports = router;
