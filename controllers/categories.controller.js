
const asyncWrapper = require("../middlewares/asyncWrapper");
const Category = require("../models/category.model");
const httpStatus = require("../utils/httpStatusText");
const appError = require("../utils/errorHandler");
const statusCodes = require("../utils/statusCodeText");
const dropData = { __v: false };

const get_categories = asyncWrapper(async (req, res, next) => {
  const categories = await Category.find({}, { ...dropData });
  return res
    .status(200)
    .json({ status: httpStatus.SUCCESS, data: { categories } });
});

const add_category = asyncWrapper(async (req, res, next) => {
  const newCategory = new Category({ ...req.body });
  newCategory.image = req.file.filename
  await newCategory.save();

  return res
    .status(201)
    .json({ status: httpStatus.SUCCESS, data: { category: newCategory } });
});

const get_category = asyncWrapper(async (req, res, next) => {
  const categoryID = req.params.id;

  const category = await Category.findById(categoryID, { ...dropData });
  if (!category) {
    const error = appError.create(statusCodes[404], 404, httpStatus.FAIL);
    return next(error);
  }
  return res
    .status(200)
    .json({ status: httpStatus.SUCCESS, data: { category } });
});

const update_category = asyncWrapper(async (req, res, next) => {
  const categoryID = req.params.id;

  await Category.findByIdAndUpdate(categoryID, {
    ...req.body
  }).then((category) => {
    if (category) {
      return res
        .status(200)
        .json({ status: httpStatus.SUCCESS, message: "Category has been updated", data: { category } });
    } else {
      const error = appError.create(statusCodes[404], 404, httpStatus.FAIL);
      return next(error);
    }
  });
});

const delete_category = asyncWrapper(async (req, res, next) => {
  const categoryID = req.params.id;
  await Category.findByIdAndDelete(categoryID).then((category) => {
    if (category) {
      return res.status(204).json({ status: httpStatus.SUCCESS, data: null });
    } else {
      const error = appError.create(statusCodes[404], 404, httpStatus.FAIL);
      return next(error);
    }
  });
});


const get_count_of_categories = asyncWrapper(
  async (req, res, next) => {
    const count = await Category.countDocuments()
    return res.status(200).json({ status: httpStatus.SUCCESS, data: { count } })
  }
)


module.exports = {
  get_categories,
  add_category,
  update_category,
  delete_category,
  get_category,
  get_count_of_categories
};
