module.exports = {
    responseToClient(res, obj={}) {
        const { httpCode=200, code=0, message="成功", data={} } = obj
        const responseData = {
            code,
            message,
            data,
        }
        res.status(httpCode).json(responseData)
    },
    formatDateTime(inputTime) {
        try {
            if (!inputTime) {
                return ""
            }
            var date = new Date(Number(inputTime))
            var y = date.getFullYear();  
            var m = date.getMonth() + 1;  
            m = m < 10 ? ('0' + m) : m;  
            var d = date.getDate();  
            d = d < 10 ? ('0' + d) : d;  
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;  
            second = second < 10 ? ('0' + second) : second; 
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;  
        } catch (e) {
            return ""
        }
    }
}