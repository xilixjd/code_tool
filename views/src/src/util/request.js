import { baseUrl } from '../config.js'

import { Message } from 'element-ui'

export default async function request(url, config={}) {
    const data = config.data || {}
    if (url.indexOf("http") < 0) {
        url = transToQueryStr(baseUrl + url, data)
    }
    // 重要！
    return await new Promise((resolve, reject) => {
        fetch(url, config)
        .then(response => {
            const status = response.status
            const jsonData = response.json()
            if (status >= 300) {
                Message.error("请求或网络错误")
            }
            return jsonData
        }).then(data => {
            if (data.code !== 0) {
                Message.error(data.message || "错误")
                reject(data)
            } else {
                resolve(data)
            }
        })
    })
}

function transToQueryStr(url, param) {
    let queryStr = ""
    let _url = url
    for (let key in param) {
        queryStr += `${key}=${param[key]}&`
    }
    if (queryStr.length > 0) {
        _url += "?" + queryStr.substring(0, queryStr.length - 1)
    }
    return _url
}