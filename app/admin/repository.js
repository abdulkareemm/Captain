const CrudRepository = require('../../lib/crud-repository');
const Admin = require('./model');

/**
 * 
 */
class AdminRepository extends CrudRepository {
    constructor() {
        super(Admin);
    }

    async findByEmail(email) {
        return await Admin.findOne({ email: email });  
    }
}

module.exports = AdminRepository;