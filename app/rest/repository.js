const CrudRepository = require('../../lib/crud-repository');
const Restaurant = require('./model');

class RestaurantRepository extends CrudRepository {
    constructor() {
        super(Restaurant);
    }
    
    async findByEmail(email) {
        return await Restaurant.findOne({ email: email });  
    }
}

// export 
module.exports = RestaurantRepository;