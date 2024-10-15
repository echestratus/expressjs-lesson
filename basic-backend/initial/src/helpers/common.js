const standardizeResponse = (res, status, statusCode, message, data) => {
    const printResponse = {
        status: status,
        statusCode: statusCode,
        message: message,
        data: data
    }
    res.status(statusCode).json(printResponse);
}

module.exports = {
    standardizeResponse
};