
require(['util/mpi', 'util/util', 'util/formUtil', 'controls/underscore', 'controls/jquery.datetimepicker', 'controls/switch/bootstrap-switch.min', 'controls/validform', 'controls/rePage', 'util/ajaxData', 'util/forMatData', 'controls/xdate', 'controls/bootstrap.min'], function(mpi, util) {
    var mapCacheState = {};
    mpi.config({
        'search': '../ddd', // 获取列表
    });

    /**
     * api接口
     * @return {object}                   包含页面的接口方法
     */
    var api = (function() {
            return {
                /**
                 * 获取账号列表
                 * @param  {number} pageNum  页码 [optional] 默认: 1
                 * @param  {function} successCallBack  成功回调函数 [required]
                 * @return {object}          api对象
                 */
                getList: function(pageNum, successCallBack) {
                    var data = _.extend({}, getJqueryObject('qqqForm').getJsonData(), {
                        pageNum: pageNum || 1,
                        pageSize: 10
                    })

                    mpi.get('search', data).ajax(function(res) {
                        successCallBack && successCallBack(res)
                    }, function() {
                        getJqueryObject('content').html('<div class="icon-none-data"> <span>当前无有效记录,开始添加吧!</span> </div>')
                    })
                    return this
                }
            }
        })()
        /**
         * 渲染util
         */
    var renderUtil = (function() {
            return {
                /**
                 * 获取非空文本
                 * @param  {string | number} id 文本
                 * @return {string | number}    处理过的文本
                 */
                getText: function(str) {
                    if (str === '') {
                        return '-'
                    }
                    return str
                },
                getOption: function(obj) {
                    /*
                    var detailHtml = '<a href="invoiceClientDetail.html?companyId=' + obj.companyId + '&companyName=' + obj.companyName + '">详情&nbsp;&nbsp;&nbsp;</a>'
                    var invoiceApplyHtml = '<a href="invoiceClientApply.html?id=' + obj.companyId + '&companyName=' + obj.companyName + '">开票&nbsp;&nbsp;&nbsp;</a>'
                    var adjustHtml = '<a realTitle="调整企业可开票金额" dialog-width="60%" dialog-height="50%" class="dialog" href="javascript:void(0);" \
                        asyn-href="invoiceClientAdjust.html?companyId=' + obj.companyId + '&companyName=' + obj.companyName + '">调整</a>'
                    return detailHtml + invoiceApplyHtml + adjustHtml
                    */
                }
            }
        })()

    var getJqueryObject = function(id, force) {
        var cache = getJqueryObject.mapJqueryState
        if (!force && cache[id]) {
            return cache[id]
        }
        _.extend(cache, $(document).getJqueryObjects())
        return cache[id]
    }
    getJqueryObject.mapJqueryState = {}



    var init = function() {
        var num = util.getParam(location.href, 'pageNum') ? util.getParam(location.href, 'pageNum') : 1

        pageNation = new Page({
            contain: getJqueryObject('content')
        })
        api.getList(num, renderTable)
        $('[component="switch"]').bootstrapSwitch()
        mapCacheState['resetData'] = getJqueryObject('invoiceClientListForm').getJsonData()
    }

    var renderTable = function(data) {
        data = data.data;
        var options;
        var $content = getJqueryObject('content')
        if (data.dataList && data.dataList.length > 0) {
            _.extend(data, renderUtil)
            $content.html(_.template($('#listtmp').html(), data));
            $("[data-toggle = 'tooltip']").tooltip();
            options = {
                total: data.total,
                pageNum: data.pageNum,
                pageSize: data.pageSize
            };
            pageNum = data.pageNum;
            pageNation.renderPage(options);
        } else {
            $content.html('<div class="icon-none-data"> <span>当前无有效记录,开始添加吧!</span> </div>');
        }
    };

    var bindEvent = function() {
        $(document).on('submit', 'form', function(e) { // 查询
            api.getList(1, renderTable)

            return false
        })

        $(pageNation).on('pageChange', function(e, num) { // 分页
            api.getList(num, renderTable);

        })
    };

    init()
    bindEvent()
});