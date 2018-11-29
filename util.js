module.exports = {
    responseToClient(res, obj={}) {
        const { httpCode=200, code=0, message="成功", data={} } = obj
        const responseData = {
            code,
            message,
            data,
        }
        res.status(httpCode).json(responseData)
    }
}