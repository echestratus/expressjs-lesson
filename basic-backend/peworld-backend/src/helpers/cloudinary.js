const createHttpError = require('http-errors');
const cloudinary = require('../configs/cloudinary');


const deleteFileInCloudinary = async (public_id, next) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        return result; 
    } catch (err) {
        console.log(err);
        next(createHttpError(400, err.message));
    }
}


module.exports = {
    deleteFileInCloudinary
}