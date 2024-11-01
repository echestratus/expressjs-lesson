require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config().cloud_name;

module.exports = cloudinary;