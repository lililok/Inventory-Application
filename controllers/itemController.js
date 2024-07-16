const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const multer = require('multer');
const path = require('path');
const cloudinary = require('../cloudinary');
const { body, validationResult } = require("express-validator");

const upload = multer({ dest: path.join(__dirname, '../uploads') });

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numItems,
    numCategories,
  ] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

    res.render("index", {
      title: "My Inventory Home",
      items_count: numItems,
      categories_count: numCategories,
  });
});

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find()
  .populate("category")
  .exec();

  res.render("item_list", { title: "Item List", item_list: allItems })
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec()

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", {
    name: item.name,
    item: item,
  });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();

  res.render("item_form", {title: "Create item", categories: allCategories})
});

exports.item_create_post = [
  upload.single('image'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const result = await cloudinary.uploader.upload(req.file.path);
    let imageUrl = result.secure_url;
    console.log(imageUrl)
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      amount: req.body.amount,
      image: imageUrl,
    })

    if (!errors.isEmpty()) {
      const categories = await Category.find().exec();
      res.render('item_form', {
        title: 'Create Item',
        item: item,
        categories: categories,
        errors: errors.array()
      });
      return;
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
]

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec()
  const allCategories = await Category.find().exec();

  if (item === null) {
    res.redirect("/inventory/items");
  }

  res.render("item_delete", {
    title: "Delete Item",
    item: item,
    categories: allCategories
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec()

  if (item === null) {
    res.redirect("/inventory/items");
  }

  await Item.findByIdAndDelete(req.body.id);
  res.redirect("/inventory/items");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec()

  if (item === null) {
    res.redirect("/inventory/items");
  }

  res.render("item_form", {
    title: "Update Item",
    item: item,
  });
});

exports.item_update_post = [
  
]