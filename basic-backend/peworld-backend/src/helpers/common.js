const fs = require('fs');
const createHttpError = require('http-errors');

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

const deleteLocalFile = (path, next) => {
    fs.unlink(path, (err) => {
        if (err) {
            return next(createHttpError(400, err.message));
        } else {
            console.log('File in local deleted successfully!');
        }
    });
}

module.exports = {
    standardizeResponse,
    deleteLocalFile
}