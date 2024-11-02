const createHttpError = require('http-errors');
const {createUser, selectByEmail} = require('../models/users');
const {createWorker, selectAllWorkers, selectWorkerById, updateWorker, totalWorkers} = require('../models/workers');
const {standardizeResponse, deleteLocalFile} = require('../helpers/common');
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const { selectSkillsByWorkerId } = require('../models/skills');
const { selectProfilePictureByWorkerId, insertProfilePicture, updateProfilePicture } = require('../models/profilePictures');
const { deleteFileInCloudinary } = require('../helpers/cloudinary');
const { selectExperiencesByWorkerId } = require('../models/experiences');
const { selectCompanyLogoByWorkExperienceId } = require('../models/experienceCompanyLogo');

const registerWorker = async (req, res, next) => {
    try {
        const {name, email, phone, password} = req.body;

        //Validation
        const nameRegex = /\w+/i;
        const emailRegex = /(?:^)[A-Za-z0-9_]+@[\w]+[.][\w.]+(?:$)/i;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i;
        const phoneRegex = /^\d{8,}$/i;

        const errorValidation = {};
        if (!nameRegex.test(name)) {
            errorValidation.name = "Name should have at least 1 character";
        }
        if (!emailRegex.test(email)) {
            errorValidation.email = "Email must contain format of email address";
        }
        if (!passwordRegex.test(password)) {
            errorValidation.password = ["password must contain at least one uppercase letter", "password must contain at least one lowercase letter", "password must contain at least one digit", "password must contain at least one special character from @$!%*?&", "password should have at least 8 characters total"];
        }
        if (!phoneRegex.test(phone)) {
            errorValidation.phone = "phone must contain at least 8 digits of number";
        }
        if (Object.keys(errorValidation).length > 0) {
            return next(createHttpError(406, "Validation Error", {details: errorValidation}));
        }

        //Same email on DB cannot be registered
        const getData = (await selectByEmail(email)).rows; 
        if (getData.length !== 0) {
            return next(createHttpError(406, "Email already registered"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const userData = {
            id: uuidv4(),
            email,
            password: hashedPassword,
            role: 'worker'
        }

        const workerData = {
            id: uuidv4(),
            name,
            phone,
            user_id: userData.id
        }

        const data = {
            worker_id: workerData.id,
            name: workerData.name,
            phone: workerData.phone,
            user_id: userData.id,
            email: userData.email,
            role: userData.role
        }

        await createUser(userData);
        await createWorker(workerData);

        standardizeResponse(res, "success", 201, "data sent successfully", data);
    } catch (err) {
        console.log(err);
        next(createHttpError(406, err.message));
    }
}

const getAllWorkers = async (req, res, next) => {
    try {
        const orderBy = req.query.orderBy || "created_at";
        const order = req.query.order || "ASC";
        const limit = req.query.limit || 2;
        const page = req.query.page || 1;
        const offset = (page - 1) * limit;
        const search = req.query.search || "";
        const totalData = parseInt((await totalWorkers()).rows[0].count);
        const totalPage = Math.ceil(totalData / limit);
        const workers = (await selectAllWorkers(orderBy, order, limit, offset, search)).rows;
        for (const index in workers) {
            workers[index].profile_picture = (await selectProfilePictureByWorkerId(workers[index].id)).rows[0] || null;
            workers[index].skills = (await selectSkillsByWorkerId(workers[index].id)).rows;
        }
        const pagination = {
            orderBy,
            order,
            limit,
            page,
            offset,
            search,
            totalData,
            totalPage
        }
        standardizeResponse(res, "success", 200, "Workers fetched successfully", workers, pagination);
    } catch (err) {
        console.log(err);
        next(createHttpError(400, err.message));
    }
}

const getMyProfile = async (req, res, next) => {
    try {
        const {rows:[myProfile]} = await selectWorkerById(req.decoded.data.id);
        myProfile.profile_picture = (await selectProfilePictureByWorkerId(myProfile.id)).rows[0] || null;
        myProfile.skills = (await selectSkillsByWorkerId(myProfile.id)).rows;
        myProfile.work_experiences = (await selectExperiencesByWorkerId(myProfile.id)).rows;
        for (const index in myProfile.work_experiences) {
            myProfile.work_experiences[index].company_logo = (await selectCompanyLogoByWorkExperienceId(myProfile.work_experiences[index].id)).rows[0] || null;
        }
        const created_at = new Date(myProfile.created_at);
        const updated_at = new Date(myProfile.updated_at);
        myProfile.created_at = created_at.getDate() + '-' + (created_at.getMonth() + 1) + '-' + created_at.getFullYear() + ' ' + created_at.getHours() + ':' + created_at.getMinutes() + ':' + created_at.getSeconds();
        myProfile.updated_at = updated_at.getDate() + '-' + (updated_at.getMonth() + 1) + '-' + updated_at.getFullYear() + ' ' + updated_at.getHours() + ':' + updated_at.getMinutes() + ':' + updated_at.getSeconds();
        standardizeResponse(res, "success", 200, "Profile fetched successfully", myProfile);
    } catch (err) {
        next(createHttpError(400, err.message));
    }
}

const getWorkerProfile = async (req, res, next) => {
    try {
        const id = req.params.id;
        const {rows:[worker]} = await selectWorkerById(id);
        worker.profile_picture = (await selectProfilePictureByWorkerId(worker.id)).rows[0] || null;
        worker.skills = (await selectSkillsByWorkerId(worker.id)).rows;
        worker.work_experiences = (await selectExperiencesByWorkerId(worker.id)).rows;
        for (const index in worker.work_experiences) {
            worker.work_experiences[index].company_logo = (await selectCompanyLogoByWorkExperienceId(worker.work_experiences[index].id)).rows[0] || null;
        }
        if (!worker) {
            return next(createHttpError(400, "Worker Not Found"));
        }
        const created_at = new Date(worker.created_at);
        const updated_at = new Date(worker.updated_at);
        worker.created_at = created_at.getDate() + '-' + (created_at.getMonth() + 1) + '-' + created_at.getFullYear() + ' ' + created_at.getHours() + ':' + created_at.getMinutes() + ':' + created_at.getSeconds();
        worker.updated_at = updated_at.getDate() + '-' + (updated_at.getMonth() + 1) + '-' + updated_at.getFullYear() + ' ' + updated_at.getHours() + ':' + updated_at.getMinutes() + ':' + updated_at.getSeconds();
        standardizeResponse(res, "success", 200, "Profile fetched successfully", worker);
    } catch (err) {
        next(createHttpError(400, err.message));
    }
}

const updateWorkerProfile = async (req, res, next) => {
    try {
        const {name, job_desk, domicile, workplace, description, phone} = req.body;
        const id = req.decoded.data.id;
        const {rows:[profile]} = await selectWorkerById(id);
        const data = {
            id,
            name: name || profile.name,
            job_desk: job_desk || profile.job_desk,
            domicile: domicile || profile.domicile,
            workplace: workplace || profile.workplace,
            description: description || profile.description,
            phone: phone || profile.phone
        }
        await updateWorker(data);
        standardizeResponse(res, "success", 200, "Profile updated", data);
    } catch (err) {
        next(createHttpError(400, err.message));
    }
}

const updateOrAddWorkerProfilePicture = async (req, res, next) => {
    try {
        //Delete uploaded file
        deleteLocalFile(req.file.path, next);

        const worker_id = req.decoded.data.id;
        const {rows:[profilePicture]} = await selectProfilePictureByWorkerId(worker_id);
        if (!profilePicture) {
            //Post new profile picture there isn't any
            const data = {
                id: req.cloudinaryAsset.public_id,
                file_url: req.cloudinaryAsset.url,
                worker_id: worker_id
            }
            await insertProfilePicture(data);
            standardizeResponse(res, "success", 200, "Profile picture uploaded successfully", data);
        } else {
            //Update profile picture if there is already
            deleteFileInCloudinary(profilePicture.id);
            const data = {
                id: req.cloudinaryAsset.public_id,
                file_url: req.cloudinaryAsset.url,
                worker_id: worker_id
            }

            await updateProfilePicture(data);
            standardizeResponse(res, "success", 200, "Profile picture updated successfully", data);
        }
    } catch (err) {
        console.log(err);
        deleteFileInCloudinary(req.cloudinaryAsset.public_id);
        next(createHttpError(400, err.message));
    }
}

module.exports = {
    registerWorker,
    getAllWorkers,
    getMyProfile,
    getWorkerProfile,
    updateWorkerProfile,
    updateOrAddWorkerProfilePicture
}