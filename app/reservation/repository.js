const CrudRepository = require("../../lib/crud-repository");
const Reservation = require('./model');
/**
 * 
 */
class ReservationRepository extends CrudRepository {
    constructor() {
        super(Reservation);
    }
}

// export
module.exports = ReservationRepository;