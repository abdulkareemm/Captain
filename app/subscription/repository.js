const CrudRepository = require("../../lib/crud-repository");
const Subscribe = require("./model");

class Subscription extends CrudRepository {
  constructor() {
    super(Subscribe);
  }
  async findByEmail(email) {
    return await Subscribe.findOne({ email: email });
  }
  async findByName(name) {
    return await Subscribe.findOne({ name: name });
  }
  async findByPhone(phone) {
    return await Subscribe.findOne({ phone: phone });
  }
}

// export
module.exports = Subscription;
