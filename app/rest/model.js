const UserSchema = require("../../lib/schemas/user-schema");
const mongoose = require("mongoose");

class RestaurantSchema extends UserSchema {
  constructor() {
    super(true);
    this.add({
      active: {
        type: Boolean,
        default: true,
      },
      expiration_date: {
        type: Date,
        required: [true, "expiration date is required!"],
      },
      phone_contact: [{
          name: String,
          number: String,
          defult: { name: "", number: "" },
        },
      ],
      web_links: [
        { name: String, link: String, defult: { name: "", link: "" } },
      ],
      workingStart: {
        type: String,
        default: "",
      },
      workingEnd: {
        type: String,
        default: "",
      },
    });
  }
}

const Restaurant = mongoose.model("restaurants", new RestaurantSchema().schema);

// exports
module.exports = Restaurant;
