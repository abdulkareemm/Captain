const CrudRepository = require("../../lib/crud-repository");
const Taxes = require("./model");

class TaxesRepository extends CrudRepository {
  constructor() {
    super(Taxes);
  }
}

module.exports = TaxesRepository;
