const mongoose = require("mongoose");
const AbstractSchema = require("../../lib/schemas/abstract-schema");

/**
 *
 */
class ItemSchema extends AbstractSchema {
  constructor() {
    super(
      {
        mealId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "meals",
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, `Quantity can't be less than 1.`],
        },
        mealName: {
          type: String,
          required: true,
        },
      },
      false
    );
  }
}

const itemSchema = new ItemSchema().schema;

/**
 * My solution is to turn the cart into order
 * and thus we'll be able to solve the multiple cart problem
 *
 */
class CartSchema extends AbstractSchema {
  constructor() {
    super(
      {
        items: [itemSchema],
        tableId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "tables",
        },
        cartTotal: {
          type: Number,
          default: 0,
        },
      },
      true
    );
  }
}

const Cart = mongoose.model("carts", new CartSchema().schema);
module.exports = { Cart, itemSchema };
