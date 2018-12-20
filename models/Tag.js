const Tag = require("../mongodb/db").Tag

module.exports = {
    async getTag(name) {
        const query = {}
        query.name = name
        return Tag
            .findOne(query)
            .exec()
    },
    async getTags() {
        const query = {}
        return Tag
            .find(query)
            .sort({ _id: 1 })
            .exec()
    },
    async addTag(tag) {
        return Tag.create(tag).exec()
    }
}