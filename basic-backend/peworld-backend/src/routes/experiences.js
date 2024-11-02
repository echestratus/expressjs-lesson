const express = require('express');
const route = express.Router();
const {addWorkExperience, getWorkExperiences, getWorkerWorkExperiences} = require('../controllers/experiences');
const {protected} = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const { uploadToCloudinary } = require('../middlewares/cloudinary');
const {updateOrAddCompanyLogo} = require('../controllers/experiences');

route.post('/', protected, addWorkExperience);
route.get('/', protected, getWorkExperiences);
route.get('/:id', protected, getWorkerWorkExperiences);
route.put('/company-logo/:experience_id', protected, upload.single('image'), uploadToCloudinary, updateOrAddCompanyLogo);

module.exports = {
    route
}