const AbstractSchema = require("./abstract-schema");

class UsernamePasswordSchema extends AbstractSchema {
  constructor(timestamps) {
    super(
      {
        username: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: [true, "Password is required!"],
        },
      },
      timestamps
    );
  }
}

// export
module.exports = UsernamePasswordSchema;
