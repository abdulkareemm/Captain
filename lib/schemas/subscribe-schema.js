const AbstractSchema = require("./abstract-schema");

class Subscribe extends AbstractSchema {
  constructor(timestamps) {
    super(
      {
        name: {
          type: String,
          required: [true, "Name is required"],
        },
        email: {
          type: String,
          required: [true, "Email is required!"],
        },
        address: {
          type: String,
          required: [true, "Address is required!"],
        },
        phone: {
          type: String,
          required: [true, "Phone number is required!"],
        },
        note: {
          type: String,
        },
        status: {
          type: String,
        },
      },
      { timestamps: timestamps }
    );
  }
}

// Exports Schema
module.exports = Subscribe;
