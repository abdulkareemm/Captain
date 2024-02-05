const AbstractSchema = require("../../lib/schemas/abstract-schema");
const mongoose = require("mongoose");
class TaxesSchema extends AbstractSchema {
  constructor() {
    super(
      {
        rest_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "restaurants",
        },
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["ثابتة", "متغيرة"],
          default: "ثابتة",
          required: true,
        },
        value: {
          type: Number,
          required: true,
        }
      },
      true
    );
  }
}

const Tax = mongoose.model("taxes", new TaxesSchema().schema);
// exports
module.exports = Tax;
