const History = require("../mongodb/db").History

module.exports = {
    getAllHistory() {
        const query = {}
        return History
            .find(query)
            .sort({ _id: -1 })
            .exec()
    },
    getHistoryById(_id) {
        const query = {}
        if (_id) {
            query._id = _id
        }
        return History
            .findOne(query)
            .exec()
    },
    addHistory(tag) {
        return History.insertOne(tag).exec()
    },
    deleteHistoryById(_id) {
        return History.deleteOne({ _id }).exec()
    }
}