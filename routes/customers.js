var express = require("express");
var router = express.Router();
var data = require("../data/customers.json");

var { write } = require("../helpers/fileHelper");
const fileName = "./data/customers.json";
/* GET customer listing. */
router.get("/", function (req, res, next) {
  res.send(data);
});
router.get("/:id", function (req, res, next) {
  const id = req.params.id;
  let found = data.find((x) => x.id == id);
  if (found) {
    return res.send(found);
  }
  res.sendStatus(410);
});
// //search for customers
// router.get("/search", function (req, res, next) {
//   const name = req.query.name;
//   const age = parseInt(req.query.age);

//   let filteredData = data.filter((x) => {
//     return x.name.toLowerCase().includes(name.toLowerCase()) && x.age === age;
//   });

//   res.send(filteredData);
// });

//DELETE BY ID
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

// POST
router.post("/", function (req, res, next) {
  const newCustomer = req.body;
  data.push(newCustomer);
  write(fileName, data);
  res.send("ok");
});
// UPDATE by id
router.patch("/:id", function (req, res, next) {
  const id = req.params.id;
  const body = req.body;
  let found = data.find((x) => x.id == id);
  if (!found) {
    return res.sendStatus(410);
  }
  for (const key in body) {
    found[key] = req.body[key];
  }
  write(fileName, data);
  res.send("updated");
});

module.exports = router;
