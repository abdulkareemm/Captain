const Schema = require('mongoose').Schema;
/**
 *  Abstract Schema
 */
class AbstractSchema {
    constructor(params, timestamps){
        this.schema = new Schema(params , { timestamps: timestamps },);
    }

    add(param) {
        this.schema.add(param);
    }
}

// Export class 
module.exports = AbstractSchema;