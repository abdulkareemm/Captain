const CrudRepository = require('../../lib/crud-repository');
const Shift = require('./model');

class ShiftRepository extends CrudRepository {
    constructor() {
        super(Shift);
    }
    
    async findByStaffMemeberId(staff_id) {
        return await Shift.findOne({ staff_id: staff_id, });
    }

    async findByRestaurantId(rest_id) {
        return await Shift.findOne({ rest_id: rest_id, });
    }
}

// export
module.exports = ShiftRepository;