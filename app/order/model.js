const AbstractSchema = require("../../lib/schemas/abstract-schema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const { itemSchema } = require("../item-cart/model");

/**
 *
 */
class OrderSchema extends AbstractSchema {
  constructor() {
    super(
      {
        items: [itemSchema],
        reservationId: {
          type: ObjectId,
          ref: "reservations",
        },
        restaurantId: {
          type: ObjectId,
          ref: "restaurants",
        },
        status: {
          type: String,
          default: "sent",
        },
        notes: String,
        tableNumber: {
          type: Number,
          required: true,
        },
      },
      true
    );
  }
}

const orderSchema = new OrderSchema().schema;
const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
