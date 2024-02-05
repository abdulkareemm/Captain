/**
 * Repository Class
 */
class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    // Find ##@NOT-WORKING
    async find(filter) {
        return await this.model.find(filter);
    }

    async findOne(filter) {
        return await this.model.findOne(filter);
    }

    // Update Item 
    async updateItem(id, payload) {
        return await this.model.findByIdAndUpdate(id, payload);
    }

    // Find Item by Username
    async findByUsername(username) {
        return await this.model.findOne({ username: username, });
    }

    // Find Item by Id
    async findById(id) {
        return await this.model.findOne({ _id: id, });
    };

    // Create a new Item 
    async createItem(payload) {
        return await this.model.create(payload);
    };

    // Delete an Item 
    async deleteItem(id) {
        return await this.model.findByIdAndDelete(id);
    }
}

// Export class 
module.exports = CrudRepository;