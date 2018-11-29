const express = require("express")
const router = express.Router()

const responseToClient = require("../util").responseToClient

const ComponentModel = require("../models/Component")
const { getComponentByName } = ComponentModel

const HistoryModel = require("../models/History")
const { getHistory, addHistory } = HistoryModel

// 获取 history
router.get("/", function(req, res, next) {
    getHistory().then((data) => {
        responseToClient(res, {
            data
        })
    }).catch((error) => {
        responseToClient(res, {
            httpCode: 500,
            code: 1,
            message: error,
        })
    })
})

// 添加 history
router.get("/addHistory", function(req, res, next) {
    const name = req.query.name
    const author = req.query.author
    const componentName = req.query.componentName
    const option = req.query.option
    if (!name || !author || !componentName) {
        return responseToClient(res, {
            code: 1,
            message: "未填写完整"
        })
    }

    getComponentByName({ name: componentName }).then((component) => {
        if (!component) {
            return responseToClient(res, {
                code: 1,
                message: "没有component"
            })
        }

        const history = { name, author, component: componentName, option }
        addHistory(history).then((data) => {
            responseToClient(res)
        }).catch((error) => {
            responseToClient(res, {
                code: 1,
                message: error.message
            })
        })
    }).catch((error) => {
        responseToClient(res, {
            code: 1,
            message: error.message
        })
    })
})