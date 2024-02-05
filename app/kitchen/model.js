const UsernamePasswordSchema = require("../../lib/schemas/user-pass-schema");
const mongoose = require("mongoose");

/**
 *
 */
class KitchenSchema extends UsernamePasswordSchema {
  constructor() {
    super(true);
    super.add({
      rest_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurants",
      },
      role: {
        type: String,
        default: "kitchen",
      },
    });
  }
}

const Kitchen = mongoose.model("kitchens", new KitchenSchema().schema);

// exports
module.exports = Kitchen;
