const AbstractSchema = require("../../lib/schemas/abstract-schema");
const mongoose = require("mongoose");
/**
 *
 */
class MealSchema extends AbstractSchema {
  constructor() {
    super(
      {
        name: {
          type: String,
          required: [true, "Name is required!"],
        },
        description: {
          type: String,
          default: "No description.",
        },
        categories: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "categories",
          },
        ],
        price: {
          type: Number,
          required: [true, "Meal price is required."],
        },
        rest_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "restaurants",
        },
        imageUrl: {
          type: String
        },
      },
      true
    );
  }
}

const Meal = mongoose.model("meals", new MealSchema().schema);
// exports
module.exports = Meal;
