const CrudRepository = require("../../lib/crud-repository");
const Order = require('./model');

class OrderRepository extends CrudRepository {
    constructor() {
        super(Order);
    }

    async findByRestaurantId(id) {
        return await Order.find({restaurantId: id});
    }
    async updateItems(oid,item){
        return Order.updateOne({ _id: oid }, { $push: { items: item } });
    }
    async updateNote(oid,notes){
        await Order.update({_id:oid},[{$set : {notes:{$concat:["$notes"," "+notes]}}}],{muli:true})
    }
}

module.exports = OrderRepository;