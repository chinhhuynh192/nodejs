var express = require("express");
var router = express.Router();
var data = require("../data/categories.json");
//import yup lib
const yup = require("yup");

//validation
const validationSchema = yup
  .object()
  .shape({
    id: yup.number().required(),
    email: yup.string().email().required(),
    name: yup.string().required(),
  })
  .required();

var { write } = require("../helpers/fileHelper");
const fileName = "./data/categories.json";
/* GET categories listing. */
router.get("/", function (req, res, next) {
  res.send(data);
});
// Get one by id
router.get("/:id", function (req, res, next) {
  const id = req.params.id;

  let found = data.find((x) => x.id == id);

  if (found) {
    return res.send(found);
  }

  return res.sendStatus(410);
});
//search
router.get("/search/text", function (req, res, next) {
  const name = req.query.name;
  const price = req.query.price;
  console.log(name, price);

  res.send();
});

// POST new category
router.post("/", function (req, res, next) {
  const body = req.body;
  // Dùng Yup để xác minh dữ liệu, nếu đúng sẽ in ra "Validation passed", nếu sai sẽ in ra lỗi
  validationSchema
    .validate(body, { abortEarly: false })
    .then((value) => {
      data.push(body);
      write(fileName, data);
      return res.sendStatus(201);
    })
    .catch((err) => {
      return res.status(400).send(err.errors);
    });
});
// delete one by id
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
// edit
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
