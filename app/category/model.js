const AbstractSchema = require('../../lib/schemas/abstract-schema');
const mongoose = require('mongoose');
/**
 * 
 */
class CategorySchema extends AbstractSchema {
	constructor() {
		super(
			{
				name: {
					type: String,
					required: [true, "Name is required!"],
				},
				rest_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'restaurants',
				}
			},
			true
		);
	}
}

const Category = mongoose.model("categories", new CategorySchema().schema);
// exports 
module.exports = Category;