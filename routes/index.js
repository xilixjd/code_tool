const component = require("./component")
const history = require("./history")
const generate = require("./generate")

module.exports = function(app) {
    app.use("/component", component)
    app.use("/generate", generate)
    app.use("/history", history)
}