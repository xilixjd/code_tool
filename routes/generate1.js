const express = require("express")
const router = express.Router()

const responseToClient = require("../util").responseToClient

const ComponentModel = require("../models/Component")
const { getComponentByName, getComponentById } = ComponentModel

// %%fileName%% 为需要替换的字段
// fileName 设为 abc，替换后将替换字符串内所有 %%fileName%% 为 abc
const CRM_HTML_START = `
<!DOCTYPE HTML>
<html class="no-js">
    <head>
        <meta charset="utf-8">
        <title>%%fileName%%</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="//es-static.xiaojukeji.com/static/web/crm/styles/bootstrap.css" rel="stylesheet" type="text/css">
        <link href="//es-static.xiaojukeji.com/static/web/crm/styles/font-awesome.css" rel="stylesheet"
            type="text/css">
        <link href="//es-static.xiaojukeji.com/static/web/crm/styles/animate.css" rel="stylesheet" type="text/css">
        <link href="//es-static.xiaojukeji.com/static/web/crm/styles/style.css" rel="stylesheet" type="text/css">
        <link href="//es-static.xiaojukeji.com/static/web/crm/styles/custom.css" rel="stylesheet" type="text/css">
        <link href="//es-static.xiaojukeji.com/static/web/crm/styles/invoicelist.css" rel="stylesheet" type="text/css">
        <link href="//es-static.xiaojukeji.com/static/web/crm/styles/list.css" rel="stylesheet" type="text/css">
        <script>(function(H){H.className=H.className.replace(/\bno-js\b/,'js')})(document.documentElement)</script>
        <script>
    var Omega = Omega || {
        productName: 'omegadf4e1b8bab'
    };
    window.Omega = Omega;
    </script>
    </head>
    <body>
        <div class="userlist white-bg">
            <div class="wrapper animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-content">
                                <form class="form-inline" id="%%fileName%%Form">
                                    <div class="form-inline">`

const QUERY_INPUT_HTML = `
                                        <div class="form-group">
                                            <label for="%%queryInputKey%%" class="control-label" style="width: 78px">%%queryInputValue%%：</label>
                                            <input type="text" id="%%queryInputKey%%" name="%%queryInputKey%%" class="form-control m-l-xs">
                                        </div>`

const QUERY_SELECT_HTML = `
                                        <div class="form-group">
                                            <label for="%%querySelectKey%%" class="control-label" style="width: 78px">%%querySelectValue%%</label>
                                            <select class="form-control chosen-select m-l-xs" id="%%querySelectKey%%"  name="%%querySelectKey%%" style="width:120px;">
                                                %%queryOptionsHTML%%
                                            </select>
                                        </div>
                                        `

const QUERY_SELECT_OPTION_HTML = `<option value="%%querySelectOptionKey%%">%%querySelectOptionValue%%</option>`
const QUERY_END_HTML=`
                                    </div>
                                    <div class="form-inline">
                                        <div class="form-group">
                                            <input id="button-%%fileName%%" type="submit" class="btn btn-primary btn-search" value="查 询">
                                        </div>
                                    </div>
                                    <p class="error-wrap"></p>
                                </form>
                            </div>
                            <div class="ibox-content">
                                <div id="content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`
const TABLE_HTML = `
        <script type="template" id="listtmp">
            <table class="table table-striped table-bordered table-hover dataTable layoutfix">
                <thead>
                <tr>
                    %%tableThHtml%%
                </tr>
                </thead>
                <tbody>
                    <# _.each(dataList, function(obj,i) { #>
                        <tr class="gradeX" id='tr_<#=obj.id#>'>
                            %%tableTdHtml%%
                        </tr>
                    <# }); #>
                </tbody>
            </table>
        </script>
`
const CRM_HTML_END = `
        <script src="//es-static.xiaojukeji.com/static/web/crm/js/require-jquery.js"></script>
        <script src="//es-static.xiaojukeji.com/static/web/crm/js/controls/modernizr.js"></script>
        <script src="//es-static.xiaojukeji.com/static/web/crm/js/controls/dialogplugin/dialog.js?skin=default"></script>
        <script src="//es-static.xiaojukeji.com/static/web/crm/js/controls/dialogplugin/dialog-iframe.js"></script>
        <script src="//es-static.xiaojukeji.com/static/web/crm/js/util/dialoglink.js"></script>
        <script src="//es-static.xiaojukeji.com/static/web/crm/js/util/asynplugin.js"></script>
        <script>
            $.ajax({
                url:"//es-static.xiaojukeji.com/static/web/crm/js/configure.js",
                cache:false,
                dataType:'script',
                success:function(){
                    require(["%%fileName%%"]);
                }
            })
        </script>
    </body>
</html>
`

// 提交 CRM 的相应组件的字段，生成相应页面
router.get("/crm/:componentId", async function(req, res, next) {
    const componentId = req.params.componentId
    const fieldJsonStr = req.query.field
    if (!componentId || !fieldJsonStr) {
        return responseToClient(res, {
            code: 1,
            message: "component或field不能为空"
        })
    }
    try {
        let component = await getComponentById(componentId)
        if (!component) {
            return responseToClient(res, {
                code: 1,
                message: "没有component"
            })
        }
        
        let listHtml = CRM_HTML_START
        const componentName = component.name
        if (componentName === "list") {
            // 列表页
            // {
            //     fileName: "xxx",
            //     query: [
            //         {type: "input", queryKey: "queryValue"},
            //         {type: "select", select: {queryKey: "queryValue"}, options: [{queryKey1: "queryValue1"}, {queryKey2: "queryValue2"}]}
            //     ],
            //     table: [
            //         {tableKey1: "tableValue1"},
            //         {tableKey2: "tableValue2"},
            //         {tableKey3: "tableValue3"},
            //         {tableKey4: "tableValue4"},
            //         {tableKey5: "tableValue5"},
            //     ]
            // }
            const fieldObj = JSON.parse(fieldJsonStr)
            const fileName = fieldObj.fileName
            const queryArray = fieldObj.query
            const tableArray = fieldObj.table
            // 查询 html
            let queryHtml = ""
            // table html
            let tableHtml = ""
            for (let i = 0; i < queryArray.length; i++) {
                const oneQuery = queryArray[i]
                const type = oneQuery.type
                if (type === "input") {
                    for (let queryInputKey in oneQuery) {
                        if (queryInputKey !== "type") {
                            const queryInputValue = oneQuery[queryInputKey]
                            let temp = QUERY_INPUT_HTML.replace(/%%queryInputKey%%/g, queryInputKey)
                            temp = temp.replace(/%%queryInputValue%%/g, queryInputValue)
                            queryHtml += temp
                        }
                    }
                } else if (type === "select") {
                    let selectHtml = QUERY_SELECT_HTML
                    let optionsHtml = `<option value="">--全部--</option>`
                    
                    const select = oneQuery.select
                    const querySelectKey = Object.keys(select)[0]
                    const querySelectValue = select[querySelectKey]

                    const options = oneQuery.options
                    for (let i = 0; i < options.length; i++) {
                        const option = options[i]
                        const querySelectOptionKey = Object.keys(option)[0]
                        const querySelectOptionValue = option[querySelectOptionKey]
                        let temp = QUERY_SELECT_OPTION_HTML
                        temp = temp.replace(/%%querySelectOptionKey%%/, querySelectOptionKey)
                        temp = temp.replace(/%%querySelectOptionValue%%/, querySelectOptionValue)
                        optionsHtml += temp
                    }
                    selectHtml = selectHtml.replace(/%%querySelectKey%%/g, querySelectKey)
                    selectHtml = selectHtml.replace(/%%querySelectValue%%/g, querySelectValue)
                    selectHtml = selectHtml.replace(/%%queryOptionsHTML%%/, optionsHtml)
                    
                    queryHtml += selectHtml
                }
            }
            queryHtml += QUERY_END_HTML
            let tableThHtml = ""
            let tableTdHtml = ""
            for (let i = 0; i < tableArray.length; i++) {
                const tableKey = Object.keys(tableArray[i])[0]
                const tableValue = tableArray[i][tableKey]
                tableThHtml += `<th class="text-center">${tableValue}</th>`
                tableTdHtml += `<td class="text-center"><#=getText(obj.${tableKey})#></td>`
            }
            tableThHtml += `<th class="text-center">操作</th>`
            tableTdHtml += `<td><#=getOption(obj)#></td>`
            tableHtml = TABLE_HTML.replace(/%%tableThHtml%%/, tableThHtml)
            tableHtml = tableHtml.replace(/%%tableTdHtml%%/, tableTdHtml)

            listHtml += queryHtml
            listHtml += tableHtml
            listHtml += CRM_HTML_END
            listHtml = listHtml.replace(/%%fileName%%/g, fileName)
            console.log(listHtml)
            return responseToClient(res, {
                data: listHtml
            })
        }
    } catch(e) {
        console.log(e)
        responseToClient(res, {
            code: 1,
            message: e.message
        })
    }
})

module.exports = router