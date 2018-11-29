const Tag = require("../mongodb/db").Tag

module.exports = {
    getTags: function() {
        const query = {}
        return Tag
            .find(query)
            .sort({ _id: 1 })
            .exec()
    },
    addTag: function(tag) {
        return Tag.create(tag).exec()
    }
}