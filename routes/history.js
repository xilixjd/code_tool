const express = require("express")
const router = express.Router()

const responseToClient = require("../util").responseToClient

const ComponentModel = require("../models/Component")
const { getComponentByName } = ComponentModel

const HistoryModel = require("../models/History")
const { getAllHistory, getHistoryById, deleteHistoryById, addHistory } = HistoryModel

// 获取 history
router.get("/", async function(req, res, next) {
    try {
        const data = await getAllHistory()
        return responseToClient(res, { data })
    } catch(error) {
        return responseToClient(res, {
            code: 1,
            message: error.message,
        })
    }
})

// 获取 history
router.get("/getHistoryById", async function(req, res, next) {
    try {
        const { _id } = req.query
        const data = await getHistoryById(_id)
        return responseToClient(res, { data })
    } catch(error) {
        return responseToClient(res, {
            code: 1,
            message: error.message,
        })
    }
})

// 删除 history
router.get("/deleteHistory", async (req, res) => {
    try {
        const { _id } = req.query
        const data = await deleteHistoryById(_id)
        return responseToClient(res, { data })
    } catch(error) {
        return responseToClient(res, {
            code: 1,
            message: error.message,
        })
    }
})

// 添加 history
router.get("/addHistory", async function(req, res, next) {
    // const name = req.query.name
    // const author = req.query.author
    // const componentName = req.query.componentName
    // const option = req.query.option
    // if (!name || !author || !componentName) {
    //     return responseToClient(res, {
    //         code: 1,
    //         message: "未填写完整"
    //     })
    // }

    // try {
    //     const component = await getComponentByName({ name: componentName })
    //     if (!component) {
    //         return responseToClient(res, {
    //             code: 1,
    //             message: "没有component"
    //         })
    //     }

    //     const history = { name, author, component: componentName, option }
    //     const data = await addHistory(history)
    //     responseToClient(res)
    // } catch(e) {
    //     responseToClient(res, {
    //         code: 1,
    //         message: e.message
    //     })
    // }
    
})

module.exports = router