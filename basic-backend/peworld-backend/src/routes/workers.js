const express = require('express');
const route = express.Router();
const {registerWorker, getAllWorkers, getMyProfile, getWorkerProfile, updateWorkerProfile, updateOrAddWorkerProfilePicture} = require('../controllers/workers');
const {protected} = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');
const { uploadToCloudinary } = require('../middlewares/cloudinary');

route.post("/", registerWorker);
route.get("/", protected, getAllWorkers);
route.get("/profile", protected, getMyProfile);
route.get("/:id", protected, getWorkerProfile);
route.put("/profile", protected, updateWorkerProfile);
route.put("/profile/profile-picture", protected, upload.single('image'), uploadToCloudinary, updateOrAddWorkerProfilePicture);

module.exports = {
    route
}