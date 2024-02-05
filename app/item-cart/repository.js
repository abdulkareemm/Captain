const CrudRepository = require("../../lib/crud-repository");
const { Cart } = require('./model');

class CartRepository extends CrudRepository {
    constructor() {
        super(Cart);
    }

    /**
     * Empty the Cart and return old cart
     * @param {ObjectId} tableId 
     * @returns Cart
     */
    async emptyCart(tableId) {
        return await Cart.findOneAndUpdate({ tableId: tableId }, {
            items: [], cartTotal: 0,
        });
    }
}

module.exports = CartRepository;