const config = require("../config")

const Mongolass = require("mongolass")
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

// CRM，React，Vue 等
exports.Tag = mongolass.model("Tag", {
    name: { type: "string", required: true },
})
// 索引、唯一性
exports.Tag.index({ name: 1 }, { unique: true }).exec()

// Tag 里有 components
exports.Component = mongolass.model("Component", {
    name: { type: "string", required: true },
    tagName: { type: "string", required: true },
})

// 创建的 components 历史记录
exports.History = mongolass.model("History", {
    name: { type: "string", required: true },
    author: { type: "string", required: true },
    componentName: { type: "string", required: true },
    tagName: { type: "string", required: true },
    // 选项，暂时的想法是，把前端的请求都接收过来放到一个字段
    // 后端根据该字段做特定的处理
    // 因为这一块的数据表结构还没想好怎么设计
    field: { type: "string", required: false },
    createTime: { type: "string", required: false },
})