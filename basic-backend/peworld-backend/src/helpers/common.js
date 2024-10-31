const standardizeResponse = (res, status, statusCode, message, data, pagination) => {
    const printResponse = {
        status,
        statusCode,
        message,
        data
    }
    if (pagination) {
        printResponse.pagination = pagination;
    }
    res.status(statusCode).json(printResponse);
}

module.exports = {
    standardizeResponse
}