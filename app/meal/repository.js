const CrudRepository = require("../../lib/crud-repository");
const Meal = require("./model");

class MealRepository extends CrudRepository {
	constructor() {
		super(Meal);
	}
	async findByName(name) {
		return await Meal.findOne({ name: name });
	}
}

module.exports = MealRepository;
