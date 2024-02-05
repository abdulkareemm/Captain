const CrudRepository = require("../../lib/crud-repository");
const  items  = require("./model");

class ItemsRepository extends CrudRepository {
  constructor() {
    super(items);
  }
}

module.exports = ItemsRepository;
