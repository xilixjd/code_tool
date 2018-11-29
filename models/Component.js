const Component = require("../mongodb/db").Component

module.exports = {
    getComponents: function(tagName) {
        const query = {}
        if (tagName) {
            query.tagName = tagName
        }
        return Component
            .find(query)
            .sort({ _id: 1 })
            .exec()
    },
    getComponentByName: function(name) {
        const query = {}
        if (name) {
            query.name = name
        }
        return Component
            .findOne(query)
            .exec()
    },
    addComponent: function(data) {
        return Component.create(data).exec()
    }
}