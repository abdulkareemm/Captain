const AbstractSchema = require("../../lib/schemas/abstract-schema");
const mongoose = require('mongoose');

class ShiftSchema extends AbstractSchema {
    constructor(timestamps) {
        super({
            staff_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'staff-members',
            },
            rest_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'restaurants',
            },
            description: {
                type: String,
                default: 'No description.',
            },
            isActive: {
                type: Boolean,
                default: false,
            }
        }, timestamps);
    }
}

const Shift = mongoose.model('shifts', new ShiftSchema().schema);

// export 
module.exports = Shift;