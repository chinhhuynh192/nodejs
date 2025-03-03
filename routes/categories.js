const yup = require("yup");
var express = require("express");
var router = express.Router();
const { default: mongoose } = require("mongoose");
const { Category } = require("../models");
const ObjectId = require("mongodb").ObjectId;
const { validateSchema } = require("../validations/validateSchema");
const { createCategorySchema } = require("../validations/category.schema.yup");

mongoose.connect("mongodb://localhost:27017/online-shop");

// Methods: POST / PATCH / GET / DELETE / PUT
// Get all
router.get("/", async (req, res, next) => {
  try {
    let result = await Category.find();
    res.send(result);
  } catch (err) {
    res.sendStatus(500);
  }
});
//get by id
router.get("/:id", async (req, res, next) => {
  //validate
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup
        .string()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      const id = req.params.id;

      let found = await Category.findById(id);

      if (found) {
        return res.json(found);
      }

      return res.sendStatus(410);
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "yup",
      });
    });
});

router.post(
  "/",
  validateSchema(createCategorySchema),
  async function (req, res, next) {
    try {
      const data = req.body;
      const newItem = new Category(data);
      let result = await newItem.save();

      return res.status(201).json(result);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
);
//DELETE
router.delete("/:id", function (req, res, next) {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup
        .string()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      try {
        const id = req.params.id;

        let found = await Category.findByIdAndDelete(id);

        if (found) {
          return res.json(found);
        }

        return res.sendStatus(410);
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .json({
          type: err.name,
          errors: err.errors,
          message: err.message,
          provider: "yup",
        });
    });
});
//patch
router.patch("/:id", async function (req, res, next) {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup
        .string()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      try {
        const id = req.params.id;
        const patchData = req.body;

        let found = await Category.findByIdAndUpdate(id, patchData);

        if (found) {
          return res.sendStatus(200);
        }

        return res.sendStatus(410);
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .json({
          type: err.name,
          errors: err.errors,
          message: err.message,
          provider: "yup",
        });
    });
});

// const data = req.body;
// const newCategory = new Category(data);
// newCategory
//   .save()
//   .then((result) => {
//     newCategory.save().then((result) => {
//       res.json(result);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//     res.status(500).send(err);
//   });

module.exports = router;
