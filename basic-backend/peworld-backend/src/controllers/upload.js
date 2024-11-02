const createHttpError = require("http-errors");
const { standardizeResponse, deleteLocalFile } = require("../helpers/common");
const fs = require('fs');

const uploadFile = (req, res, next) => {
    try {

        //Delete uploaded file
        deleteLocalFile(req.file.path, next);
        
        const data = {
            file_properties: req.cloudinaryAsset
        }
        standardizeResponse(res, "success", 201, "File uploaded successfully", data);
    } catch (err) {
        next(createHttpError(400, err.message));
    }

}

module.exports = {
    uploadFile
}