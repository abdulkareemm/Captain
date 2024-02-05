const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * 
 * @param {ObjectId} id 
 */
exports.isValidId = (id) => {
    return ObjectId.isValid(id);
};