const express = require('express');
const route = express.Router();
const {addWorkExperience, getWorkExperiences, getWorkerWorkExperiences, updateWorkExperience, deleteExperienceCompanyLogo, deleteWorkerExperience} = require('../controllers/experiences');
const {protected} = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const { uploadToCloudinary } = require('../middlewares/cloudinary');
const {updateOrAddCompanyLogo} = require('../controllers/experiences');

route.post('/', protected, addWorkExperience);
route.get('/', protected, getWorkExperiences);
route.get('/:id', protected, getWorkerWorkExperiences);
route.put('/:experience_id', protected, updateWorkExperience);
route.put('/company-logo/:experience_id', protected, upload.single('image'), uploadToCloudinary, updateOrAddCompanyLogo);
route.delete('/:experience_id', protected, deleteWorkerExperience);
route.delete('/company-logo/:experience_id', protected, deleteExperienceCompanyLogo);

module.exports = {
    route
}