const CrudRepository = require("../../lib/crud-repository");
const Category = require("./model");

class CategoryRepository extends CrudRepository {
    constructor() {
        super(Category);
    }
}

module.exports = CategoryRepository;
