#!/usr/bin/env node

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
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

async function itemsCreate(index, name, description, category, price, amount) {
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

async function categoriesCreate(index, name, description) {
    const categoriedetail = {
        name: name,
        description: description,
    };

    const category = new Category(categoriedetail);
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
}

async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
        categoriesCreate(0, "Drama", "Films that focus on realistic storytelling, character development, and emotional themes."),
        categoriesCreate(1, "Sci-Fi", "Movies that explore futuristic concepts, advanced technology, and imaginative worlds."),
        categoriesCreate(2, "Action", "High-energy films featuring physical stunts, chases, and battles."),
        categoriesCreate(3, "Crime", "Stories centered around criminal activities, law enforcement, and moral ambiguity."),
        categoriesCreate(4, "Adventure", "Films that involve epic journeys, exploration, and thrilling experiences."),
        categoriesCreate(5, "Comedy", "Movies designed to entertain and amuse, often with humor and satire"),
        categoriesCreate(6, "Horror", "Films that aim to evoke fear, suspense, and tension through supernatural or macabre elements."),
        categoriesCreate(7, "Fantasy", "Stories set in imaginary worlds with magical elements and mythical creatures."),
        categoriesCreate(8, "Animation", "Movies created through animation techniques, often appealing to both children and adults."),
        categoriesCreate(9, "Romance", "Films that focus on love stories and romantic relationships."),
    ]);
}

async function createItems() {
    console.log("Adding Items");

    await itemsCreate(
        0,
        "The Shawshank Redemption",
        "A gripping drama about hope and friendship in a prison.",
        categories[0]._id,
        12.99,
        50
    );
    await itemsCreate(
        1,
        "Inception",
        "Mind-bending sci-fi thriller exploring dreams within dreams.",
        categories[1]._id,
        14.99,
        35
    );
    await itemsCreate(
        2,
        "The Dark Knight",
        "Iconic superhero film featuring Batman and the Joker.",
        categories[2]._id,
        11.99,
        40
    );
    await itemsCreate(
        3,
        "Pulp Fiction",
        "Quentin Tarantino's cult classic intertwining crime stories.",
        categories[3]._id,
        9.99,
        30
    );
    await itemsCreate(
        4,
        "Avatar",
        "Epic science fiction film set on the alien world of Pandora.",
        categories[4]._id,
        16.99,
        25
    );
}
