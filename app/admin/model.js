const UserSchema = require('../../lib/schemas/user-schema');
const mongoose = require('mongoose');
const adminTypes = require('./admin-types');

/**
 * 
 */
class AdminSchema extends UserSchema {
    constructor() {
        super(true);
        this.add({
            adminType: {
                type: String,
                default: adminTypes[0],
            }, 
        });
    }
}

const Admin = mongoose.model('admins', new AdminSchema().schema);

module.exports = Admin;