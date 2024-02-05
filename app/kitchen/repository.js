const CrudRepository = require('../../lib/crud-repository');
const Kitchen = require('./model');

/**
 * 
 */
class KitchenRepository extends CrudRepository {
    constructor() {
        super(Kitchen);
    }
}

module.exports = KitchenRepository;
