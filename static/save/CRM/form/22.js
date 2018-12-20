
require(['util/mpi', 'util/util', 'util/formUtil', 'controls/underscore', 'controls/json2', 'controls/validform', 'util/ajaxData', 'util/forMatData', 'datepicker'], function(mpi, util) {
    mpi.config({
        // "queryQualifications": "../invoice/customer/queryQualifications/v1",
    });

    // var queryQualifications = function(invoiceType) {
    //     invoiceType = invoiceType || 43
    //     var companyId = util.getQueryString().id
    //     var data = {
    //         companyId: companyId,
    //         invoiceType: invoiceType
    //     }
    //     window._ajax = false
    //     mpi.get('queryQualifications', data).ajax(function(res) {
    //         var data = res.data
    //         var optionsHtml = "<option value=''></option>"
    //         for (var i = 0; i < data.length; i++) {
    //             var invoiceTitle = data[i].invoiceTitle
    //             var invoiceId = data[i].id
    //             optionsHtml += '<option value="' + invoiceId + '">' + invoiceTitle + '</option>'
    //         }

    //         $("#selectInvoiceTitle").html(optionsHtml)
    //     }, function() {
    //     })
    // }


    var bindEvent = function() {
        // bindBackButton()
        bindSubmit()
    }

    var bindBackButton = function() {
        $("#inputBack").click(function(e) {
            history.back(-1)
        })
    }

    var bindSubmit = function(data) {
        $("#intputSubmit").unbind('click').click(function(e) {
            var validResult = submitValid(data)
            
                if (validResult !== false) {
                    $.ajax({
                        type: "post",
                        url: "222",
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function(res) {
                            var closeDialog = artDialog({
                                content: '<div style="width:200px;font-size:14px;text-align:center;"><div>'+res.message+'</div>'+
                                '<input type="button" class="oneSure btn btn-blue" style="margin-top:20px" value="确定"></div>',
                                title: '提示信息',
                            });
                            $('.oneSure').click(function() {

                            })
                        }
                    })
                }
            
        })
    }

    var submitValid = function() {
        var datatype = {
            'length50': function(gets) {
                if (gets.length > 50) {
                    return "长度需要小于50字"
                }
                return true
            },
            'length100': function(gets) {
                if (gets.length > 100) {
                    return "长度需要小于100字"
                }
                return true
            },
            'length200': function(gets) {
                if (gets.length > 200) {
                    return "长度需要小于200字"
                }
                return true
            },
            'isNeed': function(gets) {
                if (gets.length === 0) {
                    return "必填参数"
                }
                return true
            },
            'validEmail': function(gets) {
                if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{1,6}$/.test(gets)) {
                    return "邮箱格式错误"
                }
                return true
            },
            'validPhoneNumber': function(gets) {
                if (!/^[\d]{11}$/.test(gets)) {
                    return "请输入正确的手机格式"
                }
                return true
            },
            'validNumber': function(gets) {
                if (!/^[0-9]+(\.\d+)?$/.test(gets)) {
                    return "请输入正确的数字格式"
                }
                return true
            },
            'fine': function(gets) {
                return true
            }
        }
        var valid = true
        var paramDict = {}
        $("[dataType]").each(function(index, e) {
            var target = $(e)
            var validType = target.attr("dataType")
            // var isNeed = target.attr("isNeed")
            var callback = datatype[validType]
            var result = callback.call(null, target.val())
            // 不是必须
            // if (!isNeed) {
            //    result = true
            // }
            var name = target.attr("name")
            var type = target.attr("type")
            var value = target.val()
            if (type === "radio") {
                value = $("[name='" + name + "']:checked").val()
            }
            paramDict[name] = value
            if (result !== true) {
                var targetId = target.attr("id")
                $('#' + targetId + '-error').text(result)
                valid = false
                return false
            }
        })
        if (valid) {
            return paramDict
        } else {
            return false
        }
    }

    var init = function() {
        bindEvent()
    }

    init()
})