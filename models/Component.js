const Component = require("../mongodb/db").Component

module.exports = {
    async getComponents(tagName) {
        const query = {}
        if (tagName) {
            query.tagName = tagName
        }
        return Component
            .find(query)
            .sort({ _id: 1 })
            .exec()
    },
    async getComponentByName(name, tagName) {
        const query = {}
        if (name) {
            query.name = name
        }
        if (tagName) {
            query.tagName = tagName
        }
        return Component
            .findOne(query)
            .exec()
    },
    async getComponentById(_id) {
        const query = {}
        if (_id) {
            query._id = _id
        }
        return Component
            .findOne(query)
            .exec()
    },
    async addComponent(data) {
        return Component.create(data).exec()
    }
}