const express = require("express")

const ejs = require("ejs")

const config = require("./config")
const port = config.port

const responseToClient = require("./util").responseToClient

const routes = require('./routes')

const app = express()

// 跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

routes(app)

app.listen(port)