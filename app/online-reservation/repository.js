const CrudRepository = require("../../lib/crud-repository");
const OnlineReservation = require("./model");

class O_Reservation extends CrudRepository {
  constructor() {
    super(OnlineReservation);
  }
  async findByName(name) {
    return await OnlineReservation.findOne({ name: name });
  }
  async findByPhone(phone) {
    return await OnlineReservation.findOne({ phone: phone });
  }
  async findBySpam(checkSpam) {
    return await OnlineReservation.findOne({ checkSpam: checkSpam });
  }
}

// export
module.exports = O_Reservation;
