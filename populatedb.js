#! /usr/bin/env node

const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createItems();
    await createCategories();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}
  
async function itemsCreate(name, description, price, amount) {
    const itemdetail = {
      name: name,
      description: description,
      category: category,
      price: price,
      amount: amount
    };
  
    const item = new Item(itemdetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
}

async function categoriesCreate(name, description) {
    const categoriedetail = {
        name: name,
        description: description,
    };

    const category = new Category(categoriedetail);
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  }
  