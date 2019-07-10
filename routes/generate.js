const express = require("express")
const router = express.Router()
const ejs = require("ejs")
const fs = require("fs")
const path = require("path")

const { responseToClient, formatDateTime } = require("../util")

const ComponentModel = require("../models/Component")
const { getComponentByName, getComponentById } = ComponentModel
const HistoryModel = require("../models/History")
const { addHistory, getHistoryById } = HistoryModel

async function renderFilePromise(path, data) {
    return new Promise((resolve, reject) => {
        ejs.renderFile(path, data, (err, str) => {
            resolve(str)
        })
    })
}

async function generateCRMList(fieldObj) {
    const CRM_LIST_HTML_PATH = "./static/crm/list/crm_list.ejs"
    const CRM_LIST_QUERY_INPUT_PATH = "./static/crm/list/crm_list_query_input.ejs"
    const CRM_LIST_QUERY_SELECT_PATH = "./static/crm/list/crm_list_query_select.ejs"
    const CRM_LIST_QUERY_OPTION_PATH = "./static/crm/list/crm_list_query_option.ejs"

    // dynamicValidateForm: {
    //     fileName: "",
    //     author: "",
    //     inputs: [{
    //         inputKey: '',
    //         inputValue: ''
    //     }],
    //     selects: [
    //         {
    //             selectKey: '',
    //             selectValue: '',
    //             options: [
    //                 {
    //                     optionKey: '',
    //                     optionValue: '',
    //                 }
    //             ]
    //         }
    //     ],
    //     tables: [
    //         {
    //             tableKey: '',
    //             tableValue: ''
    //         }
    //     ]
    // }
    const fileName = fieldObj.fileName
    let queryHtml = ""
    const inputsArray = fieldObj.inputs
    const selectsArray = fieldObj.selects
    const tablesArray = fieldObj.tables
    for (let i = 0; i < inputsArray.length; i++) {
        const input = inputsArray[i]
        const queryInputKey = input.inputKey
        const queryInputValue = input.inputValue
        let temp = await renderFilePromise(CRM_LIST_QUERY_INPUT_PATH, { queryInputKey, queryInputValue })
        queryHtml += temp
    }
    for (let i = 0; i < selectsArray.length; i++) {
        let optionsHtml = '<option value="">--全部--</option>'
        const select = selectsArray[i]
        const querySelectKey = select.selectKey
        const querySelectValue = select.selectValue
        const options = select.options
        for (let j = 0; j < options.length; j++) {
            const option = options[j]
            const querySelectOptionKey = option.optionKey
            const querySelectOptionValue = option.optionValue
            let temp = await renderFilePromise(CRM_LIST_QUERY_OPTION_PATH, { querySelectOptionKey, querySelectOptionValue })
            optionsHtml += temp
        }
        // return options.reduce((squeen, item) => {
        //     return squeen.then(()=>{
                
        //     })
        // }, Promise.resolve()).then(()=>{})
        const selectHtml = await renderFilePromise(CRM_LIST_QUERY_SELECT_PATH, { 
            querySelectKey,
            querySelectValue,
            queryOptionsHTML: optionsHtml
        })
        queryHtml += selectHtml
    }
    let tableThHtml = ""
    let tableTdHtml = ""
    for (let i = 0; i < tablesArray.length; i++) {
        const table = tablesArray[i]
        const tableKey = table.tableKey
        const tableValue = table.tableValue
        tableThHtml += `<th class="text-center">${tableValue}</th>`
        tableTdHtml += `<td class="text-center"><#=getText(obj.${tableKey})#></td>`
    }
    tableThHtml += `<th class="text-center">操作</th>`
    tableTdHtml += `<td><#=getOption(obj)#></td>`

    let listHtml = await renderFilePromise(CRM_LIST_HTML_PATH, {
        fileName,
        queryInputSelectHtml: queryHtml,
        tableThHtml,
        tableTdHtml
    })
    return listHtml
}

async function generateCRMListJs(fieldObj) {
    const CRM_LIST_JS_PATH = './static/crm/list/crm_list_js.ejs'
    let requestUrl = fieldObj.requestUrl
    const fileName = fieldObj.fileName
    if (requestUrl.indexOf("/crm/") === 0) {
        requestUrl = requestUrl.substring(4, requestUrl.length)
        requestUrl = ".." + requestUrl
    }
    let listJs = await renderFilePromise(CRM_LIST_JS_PATH, {
        requestUrl,
        fileName
    })
    return listJs
}

async function generateCRMForm(fieldObj) {
    const CRM_FORM_HTML_PATH = './static/crm/form/crm_form_html.ejs'
    const CRM_FORM_INPUT_PATH = './static/crm/form/crm_form_input.ejs'
    const CRM_FORM_SELECT_PATH = './static/crm/form/crm_form_select.ejs'
    const CRM_FORM_OPTION_PATH = './static/crm/form/crm_form_option.ejs'
    const CRM_FORM_RADIO_PATH = './static/crm/form/crm_form_radio.ejs'
    const CRM_FORM_RADIO_INPUT_PATH = './static/crm/form/crm_form_radio_input.ejs'
    const CRM_FORM_TEXTAREA_PATH = './static/crm/form/crm_form_textarea.ejs'
    const CRM_FORM_TEXT_PATH = './static/crm/form/crm_form_text.ejs'
    // fileName: "",
    // author: "",
    // requestUrl: "",
    // isJson: "yes",
    // queryType: "input",
    // queryArray: []
    // {
    //     type: "input",
    //     queryKey: "",
    //     queryValue: "",
    //     validType: "fine",
    // },
    // {
    //     type: "select",
    //     queryKey: "",
    //     queryValue: "",
    //     validType: "fine",
    //     options: [
    //         {
    //             optionKey: "",
    //             optionValue: "",
    //         }
    //     ]
    // },
    // {
    //     type: "radio",
    //     queryKey: "",
    //     queryValue: "",
    //     validType: "fine",
    //     isChecked: 0,
    //     inputs: [
    //         {
    //             inputKey: "",
    //             inputValue: "",
    //         }
    //     ]
    // },
    // {
    //     type: "textarea",
    //     queryKey: "",
    //     queryValue: "",
    //     validType: "fine",
    // },
    // {
    //     type: "text",
    //     queryKey: "",
    //     queryValue: "",
    // }
    const fileName = fieldObj.fileName
    const isJson = fieldObj.isJson
    const queryArray = fieldObj.queryArray
    let formQueryHtml = ""
    for (let i = 0; i < queryArray.length; i++) {
        const query = queryArray[i]
        const queryKey = query.queryKey
        const queryValue = query.queryValue
        const validType = query.validType
        switch (query.type) {
            case "input":
                const inputHtml = await renderFilePromise(CRM_FORM_INPUT_PATH, {
                    queryKey,
                    queryValue,
                    validType,
                })
                formQueryHtml += inputHtml
                break
            case "textarea":
                const textareaHtml = await renderFilePromise(CRM_FORM_TEXTAREA_PATH, {
                    queryKey,
                    queryValue,
                    validType,
                })
                formQueryHtml += textareaHtml
                break
            case "text":
                const textHtml = await renderFilePromise(CRM_FORM_TEXT_PATH, {
                    queryKey,
                    queryValue,
                })
                formQueryHtml += textHtml
                break
            case "select":
                const options = query.options
                let optionsHtml = ""
                for (let i = 0; i < options.length; i++) {
                    const option = options[i]
                    const optionKey = option.optionKey
                    const optionValue = option.optionValue
                    const optionHtml = await renderFilePromise(CRM_FORM_OPTION_PATH, {
                        optionKey,
                        optionValue
                    })
                    optionsHtml += optionHtml
                }
                const selectHtml = await renderFilePromise(CRM_FORM_SELECT_PATH, {
                    optionsHtml,
                    queryKey,
                    queryValue,
                    validType,
                })
                formQueryHtml += selectHtml
                break
            case "radio":
                const inputs = query.inputs
                let radioInputHtml = ""
                for (let i = 0; i < inputs.length; i++) {
                    const input = inputs[i]
                    const inputKey = input.inputKey
                    const inputValue = input.inputValue
                    const isChecked = input.isChecked
                    const inputHtml = await renderFilePromise(CRM_FORM_RADIO_INPUT_PATH, {
                        inputKey,
                        inputValue,
                        queryKey,
                        isChecked,
                    })
                    radioInputHtml += inputHtml
                }
                const radioHtml = await renderFilePromise(CRM_FORM_RADIO_PATH, {
                    queryKey,
                    queryValue,
                    radioInputHtml
                })
                formQueryHtml += radioHtml
                break
        }
    }
    const formHtml = await renderFilePromise(CRM_FORM_HTML_PATH, {
        fileName,
        formQueryHtml,
    })
    return formHtml
}

async function generateCRMFormJs(fieldObj) {
    const CRM_FORM_JS_PATH = './static/crm/form/crm_form_js.ejs'
    const isJson = fieldObj.isJson
    const requestUrl = fieldObj.requestUrl
    const formJs = await renderFilePromise(CRM_FORM_JS_PATH, {
        isJson,
        requestUrl,
    })
    return formJs
}

// 遍历创建目录, currentPath 为项目根目录
function mkdir(currentPath) {
    if (!fs.existsSync(currentPath)) {
        var pathtmp;
        currentPath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname)
            }
            else {
                pathtmp = dirname
            }
            if (!fs.existsSync(pathtmp)) {
                fs.mkdirSync(pathtmp)
            }
        });
    }
}

router.get("/download", async (req, res) => {
    const _id = req.query._id
    const isJs = req.query.isJs
    try {
        const history = await getHistoryById(_id)
        const fieldStr = history.field
        const tagName = history.tagName
        const componentName = history.componentName
        const fieldObj = JSON.parse(fieldStr)
        const fileName = fieldObj.fileName
        const currentPath = path.join("./static", `/save/${tagName}/${componentName}`)
        let generatedCode = ""
        let filePath
        if (!isJs && tagName === "CRM" && componentName === "list") {
            generatedCode = await generateCRMList(fieldObj)
            filePath = `${currentPath}/${fileName}.html`
        } else if (isJs && tagName === "CRM" && componentName === "list") {
            generatedCode = await generateCRMListJs(fieldObj)
            filePath = `${currentPath}/${fileName}.js`
        } else if (!isJs && tagName === "CRM" && componentName === "form") {
            generatedCode = await generateCRMForm(fieldObj)
            filePath = `${currentPath}/${fileName}.html`
        } else if (isJs && tagName === "CRM" && componentName === "form") {
            generatedCode = await generateCRMFormJs(fieldObj)
            filePath = `${currentPath}/${fileName}.js`
        }
        mkdir(currentPath)
        
        fs.writeFileSync(filePath, generatedCode)
        res.download(filePath)
    } catch(error) {
        responseToClient(res, {
            code: 1,
            message: error.message
        })
    }
})

// 提交 CRM 的相应组件的字段，生成相应页面
router.get("/CRM", async function(req, res, next) {
    const fieldJsonStr = req.query.field
    const componentName = req.query.componentName
    if (!componentName || !fieldJsonStr) {
        return responseToClient(res, {
            code: 1,
            message: "component或field不能为空"
        })
    }
    try {
        const fieldObj = JSON.parse(fieldJsonStr)
        const fileName = fieldObj.fileName
        const author = fieldObj.author
        // let listHtml = await generateCRMList(fieldObj)
        
        const history = {
            name: fileName,
            author,
            componentName,
            tagName: "CRM",
            field: fieldJsonStr,
            createTime: formatDateTime(Date.now())
        }
        const addedHistory = await addHistory(history)
        const insertedId = addedHistory.insertedId
        return responseToClient(res, {
            data: {
                // generatedCode: listHtml,
                historyId: insertedId
            }
        })
    } catch(e) {
        console.log(e)
        responseToClient(res, {
            code: 1,
            message: e.message
        })
    }
})

module.exports = router