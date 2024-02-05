const mongoose = require("mongoose");
const AbstractSchema = require("../../lib/schemas/abstract-schema");

class itemsSchema extends AbstractSchema {
  constructor() {
    super(
      {
        item: {
          type: Array,
          required: true,
        },
        numberItems: Number,
        counter: {
          type: Number,
          required: true,
        },
        rest_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "restaurants",
        },
      },
      false
    );
  }
}

const items = mongoose.model("itemR", new itemsSchema().schema);
module.exports = items;
