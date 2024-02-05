const UserSchema = require("../../lib/schemas/user-schema");
const mongoose = require('mongoose');

const staffTypes = ['waiter', 'accountant', 'manager'];

class StaffSchema extends UserSchema {
    constructor() {
        super(true);
        this.add({
            rest_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'restaurants',
            },
            type: {
                type: String,
                default: staffTypes[0], // Waiter for default 
            },
        });
    }
}

const Staff = mongoose.model('staff-members', new StaffSchema().schema);

// export 
module.exports = Staff;