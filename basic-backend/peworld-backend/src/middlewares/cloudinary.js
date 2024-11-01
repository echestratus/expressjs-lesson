const createHttpError = require('http-errors');
const cloudinary = require('../configs/cloudinary');
const { standardizeResponse } = require('../helpers/common');

const uploadToCloudinary = async (req, res, next) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto",
        });
        req.cloudinaryAsset = result;
        next();
    } catch (err) {
        next(createHttpError(400, err.message));
    }
}

module.exports = {
    uploadToCloudinary
}