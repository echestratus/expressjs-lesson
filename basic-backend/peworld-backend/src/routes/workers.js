const express = require('express');
const route = express.Router();
const {registerWorker, getAllWorkers, getMyProfile, getWorkerProfile, updateWorkerProfile} = require('../controllers/workers');
const {protected} = require('../middlewares/auth');

route.post("/", registerWorker);
route.get("/", protected, getAllWorkers);
route.get("/profile", protected, getMyProfile);
route.get("/:id", protected, getWorkerProfile);
route.put("/profile", protected, updateWorkerProfile);
route.put("/profile/profile-picture", protected, );

module.exports = {
    route
}