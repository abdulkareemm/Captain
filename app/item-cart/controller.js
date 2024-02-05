const CartRepository = require("./repository");
const repo = new CartRepository();

const MealRepository = require('../meal/repository');
const mealRepo = new MealRepository();

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
exports.addToCart = async (req, res) => {
    try {
        const { id, sid, tid, } = req.params;
        const { mealId, quantity } = req.body;
        let msg = "", code;
        // If quantity is 0
        if (quantity == 0)
            return res.status(400).json({
                error: 'Quantity cannot be equal to 0.',
            });
        // Get Meal
        const meal = await mealRepo.findById(mealId);
        if (!meal)
            return res.status(400).json({
                error: 'Meal does not exist!',
            });
        // Check for an existing cart for the current table 
        let cart = await repo.findOne({ tableId: tid, });
        // If cart exists 
        if (cart) {
            const mealIndex = cart.items.findIndex(item => item.mealId == mealId);

            if (mealIndex !== -1 && quantity > 0) {
                cart.items[mealIndex].quantity += quantity;
                cart.items[mealIndex].total = cart.items[mealIndex].quantity * meal.price;
                cart.items[mealIndex].price = meal.price; // Check this
            } else if (mealIndex === -1 && quantity > 0) {
                cart.items.push({
                    mealId: mealId,
                    quantity: quantity,
                    price: meal.price,
                    total: meal.price * quantity,
                });
            }
            // update total 
            cart.cartTotal = getItemsTotal(cart.items);
            await repo.updateItem(cart._id, cart);
            msg = "Cart updated."
            code = 200
        } else {
            // If cart does NOT exist 'undefined'
            cart = await repo.createItem({
                items: [{
                    mealId: mealId,
                    quantity: quantity,
                    price: meal.price,
                    total: meal.price * quantity,
                }], tableId: tid, cartTotal: meal.price * quantity,
            });
            msg = "Cart created."
            code = 201
        }
        return res.status(code).json({
            msg,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }
}

function getItemsTotal(items) {
    return items
        .map(item => item.total)
        .reduce((acc, next) => acc + next);
}