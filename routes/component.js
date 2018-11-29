const express = require("express")
const router = express.Router()

const responseToClient = require("../util").responseToClient

const TagModel = require("../models/Tag")
const { getTags, addTag } = TagModel

const ComponentModel = require("../models/Component")
const { getComponents, addComponent } = ComponentModel

// 获取 tags
router.get("/", function(req, res, next) {
    getTags().then((data) => {
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

// 添加 tag
router.get("/addTag", function(req, res, next) {
    const name = req.query.name
    if (!name) {
        return responseToClient(res, {
            code: 1,
            message: "未填写name"
        })
    }
    addTag({ name }).then((data) => {
        responseToClient(res)
    }).catch((error) => {
        responseToClient(res, {
            code: 1,
            message: error.message
        })
    })
})

// 根据 tag 获取 component
router.get("/getComponents", function(req, res, next) {
    const { tag } = req.query
    try {
        if (!tag) {
            throw new Error("没有tag")
        }
    } catch (e) {
        return responseToClient(res, {
            code: 1,
            message: e.message
        })
    }
    getComponents(tag).then((data) => {
        responseToClient(res, {
            data
        })
    })
})

// 添加 component
router.get("/addComponent", function(req, res, next) {
    const tagName = req.query.tagName
    const name = req.query.name
    if (!name || !tagName) {
        return responseToClient(res, {
            code: 1,
            message: "未填写name或tagName"
        })
    }
    const component = { name, tagName }
    addComponent(component).then((data) => {
        responseToClient(res)
    }).catch((error) => {
        responseToClient(res, {
            code: 1,
            message: error.message
        })
    })
})



module.exports = router