const express = require('express');
const route = express.Router();
const {upload} = require('../middlewares/upload');
const {uploadFile} = require('../controllers/upload');
const {uploadToCloudinary} = require('../middlewares/cloudinary');

route.post('/', upload.single('image'), uploadToCloudinary, uploadFile);

module.exports = {
    route
}