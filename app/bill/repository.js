const CrudRepository = require("../../lib/crud-repository");
const Bill = require("./model");

class BillRepository extends CrudRepository {
  constructor() {
    super(Bill);
  }
  async getAllBillSorted(rest_id, pageNumber) {
    return await Bill.find({ rest_id: rest_id })
      .sort({ createdAt: 1 })
      .skip((pageNumber) * 10)
      .limit(10);
  }
  async getCountDoc(rest_id){
    return await Bill.find({rest_id}).countDocuments()
  }
}

module.exports = BillRepository;
