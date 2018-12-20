const express = require("express")
const router = express.Router()

const responseToClient = require("../util").responseToClient

const TagModel = require("../models/Tag")
const { getTag, getTags, addTag } = TagModel

const ComponentModel = require("../models/Component")
const { getComponents, addComponent, getComponentByName } = ComponentModel

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
    }).catch((error) => {
        responseToClient(res, {
            code: 1,
            message: error.message
        })
    })
})

// 根据所有 tag 及其 components
router.get("/all", async function(req, res, next) {
    try {
        const tags = await getTags()
        const resData = []
        for (let i = 0; i < tags.length; i++) {
            const tagName = tags[i].name
            const components = await getComponents(tagName)
            resData.push({
                components,
                tagName: tagName
            })
        }
        return responseToClient(res, { data: resData })
    } catch(e) {
        return responseToClient(res, {
            code: 1,
            message: e.message,
        })
    }
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
    getTag(tagName).then((data) => {
        if (!data) {
            return responseToClient(res, {
                code: 1,
                message: "没有此tag"
            })
        }
        getComponentByName(name, tagName).then((data) => {
            if (data) {
                return responseToClient(res, {
                    code: 1,
                    message: "该tag下已有了该component"
                })
            }
            addComponent(component).then((data) => {
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
    }).catch((error) => {
        responseToClient(res, {
            code: 1,
            message: error.message
        })
    })
})



module.exports = router