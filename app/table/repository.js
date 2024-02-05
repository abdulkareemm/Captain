const CrudRepository = require('../../lib/crud-repository');
const Table = require('./model');

class TableRepository extends CrudRepository {
    constructor() {
        super(Table);
    }

    async findByRestaurantId(rest_id) {
        return await Table.find({ rest_id: rest_id, });
    }

    async findBySerialNo(serialNo) {
        return await Table.findOne({ serialNo: serialNo, });
    }

    async updateTableInfo(id, payload) {
        return await Table.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            context: 'query',
        });
    }
}

module.exports = TableRepository;