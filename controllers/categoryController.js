const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();

  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    name: category.name,
    category: category,
    items: items
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", {title: "Create category"})
});

exports.category_create_post = [
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      const category = new Category({
        name: req.body.name,
        description: req.body.description,
      });

      if (!errors.isEmpty()) {
        res.render("category_form", {
          title: "Create category",
          category: category,
          errors: errors.array(),
        });
        return;
      } else {
        await category.save();
        res.redirect(category.url);
      }
    })
]

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    res.redirect("/inventory/categories");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_items: items,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (items.length > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_items: items,
    });
    return;
  } else {
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/inventory/categories");
  }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec()

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update category",
    category: category,
  });
});

exports.category_update_post = [
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      const category = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id,
      });

      if (!errors.isEmpty()) {
        res.render("category_form", {
          title: "Create category",
          category: category,
          errors: errors.array(),
        });
        return;
      } else {
        await Category.findByIdAndUpdate(req.params.id, category);
        res.redirect(category.url);
      }
    })
]