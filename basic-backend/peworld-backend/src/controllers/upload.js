const createHttpError = require("http-errors");
const { standardizeResponse } = require("../helpers/common");
const fs = require('fs');

const uploadFile = (req, res, next) => {
    try {

        //Delete uploaded file
        fs.unlink(req.file.path, (err) => {
            if (err) {
                return next(createHttpError(400, err.message));
            } else {
                console.log('File deleted successfully!');
            }
        });
        
        const data = {
            file_url: req.cloudinaryAsset
        }
        standardizeResponse(res, "success", 201, "File uploaded successfully", data);
    } catch (err) {
        next(createHttpError(400, err.message));
    }

}

module.exports = {
    uploadFile
}