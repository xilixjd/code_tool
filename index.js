const express = require("express")

const config = require("./config")
const port = config.port

const routes = require('./routes')

const app = express()

app.get('/', (req, res) => res.send("hello world"))
routes(app)

app.listen(port)