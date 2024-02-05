const AbstractSchema = require("../../lib/schemas/abstract-schema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

class BillSchema extends AbstractSchema {
  constructor() {
    super(
      {
        dishes: [
          {
            mealName: String,
            quantity: Number,
            mealPrice: Number,
            total: Number,
          },
        ],
        reservationId: {
          type: ObjectId,
          ref: "reservations",
        },
        total: Number,
        discount: {
          type: Number,
          default: 0,
          min: 0,
          max: 50,
        },
        taxes: [
          {
            name: String,
            value: Number,
          },
        ],
        waiterName: {
          type: String,
        },
        tableNumber: {
          type: Number,
        },
        rest_id: {
          type: ObjectId,
          ref: "restaurants",
        },
      },
      true
    );
  }
}

const Bill = mongoose.model("bills", new BillSchema().schema);

module.exports = Bill;
