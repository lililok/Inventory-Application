const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    year: { type: Date },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    image: { type: String }
});

ItemSchema.virtual("url").get(function () {
    return `/inventory/item/${this._id}`;
  });

module.exports = mongoose.model("Item", ItemSchema);
