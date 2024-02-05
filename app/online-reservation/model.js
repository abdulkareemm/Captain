const AbstractSchema = require("../../lib/schemas/abstract-schema");
const mongoose = require("mongoose");

class OnlineReservation extends AbstractSchema {
  constructor() {
    super(
      {
        name: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          default: "pending",
        },
        phone: {
          type: Number,
          required: true,
        },
        numberTable: {
          type: Number,
          required: true,
        },
        dateOfReservation: {
          type: String,
          required: true,
        },
        note: {
          type: String,
          default: "",
        },
        rest_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "restaurants",
        },
        checkSpam : {
            type : String,
            required: true,
        }
      },
      true
    );
  }
}

const O_Reservation = mongoose.model(
  "online-reservations",
  new OnlineReservation().schema
);
// exports
module.exports = O_Reservation;
