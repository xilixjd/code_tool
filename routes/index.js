const component = require("./component")

module.exports = function(app) {
    app.use("/component", component)
}