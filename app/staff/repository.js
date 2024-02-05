const CrudRepository = require("../../lib/crud-repository");
const Staff = require('./model');

class StaffRepository extends CrudRepository {
    constructor() {
        super(Staff);
    }

    async findByEmail(email) {
        return await Staff.findOne({ email: email });  
    }
}

// export 
module.exports = StaffRepository;