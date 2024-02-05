const SubscribeSchema = require("../../lib/schemas/subscribe-schema");
const mongoose = require("mongoose");

class SubscriptionSchema extends SubscribeSchema {
  constructor() {
    super(true);
  }
}

const Subscription = mongoose.model(
  "Subscriptions",
  new SubscriptionSchema().schema
);

// exports
module.exports = Subscription;
