const AbstractSchema = require("./abstract-schema");

class UserSchema extends AbstractSchema {
  constructor(timestamps) {
    super(
      {
        username: {
          type: String,
          required: [true, "Username is required!"],
        },
        name: {
          type: String,
          required: [true, "Name is required"],
        },
        password: {
          type: String,
          required: [true, "Password is required!"],
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
        avatar: {
          type: String,
          default: "",
        },
        role: {
          type: String,
        },
      },
      { timestamps: timestamps }
    );
  }
}

// Exports Schema
module.exports = UserSchema;
