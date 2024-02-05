const AbstractSchema = require('./AbstractSchema');

/**
 * 
 */
class GeoSchema extends AbstractSchema {
    constructor(timestamps) {
        super({
            type: {
                type: String,
                default: "Point",
                required: [true, 'Type property is required!'],
            },
            coordinates: {
                type: [Number],
                default: [0, 0],
            },
        }, timestamps);
    }
}


module.exports = GeoSchema;