const History = require("../mongodb/db").History

module.exports = {
    getHistory: function() {
        const query = {}
        return History
            .find(query)
            .sort({ _id: -1 })
            .exec()
    },
    addHistory: function(tag) {
        return History.create(tag).exec()
    }
}