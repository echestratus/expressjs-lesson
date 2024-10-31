const createError = require('http-errors');
const {createUser, selectByEmail} = require('../models/users');
const {createWorker, selectAllWorkers, selectWorkerById, updateWorker, totalWorkers} = require('../models/workers');
const {standardizeResponse} = require('../helpers/common');
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');

const registerWorker = async (req, res, next) => {
    try {
        const {name, email, phone, password} = req.body;

        //Same email on DB cannot be registered
        const getData = (await selectByEmail(email)).rows; 
        if (getData.length !== 0) {
            return next(createError(406, "Email already registered"));
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
        next(createError(406, err.message));
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
        next(createError(400, err.message));
    }
}

const getMyProfile = async (req, res, next) => {
    try {
        const {rows:[myProfile]} = await selectWorkerById(req.decoded.data.id);
        const created_at = new Date(myProfile.created_at);
        const updated_at = new Date(myProfile.updated_at);
        myProfile.created_at = created_at.getDate() + '-' + (created_at.getMonth() + 1) + '-' + created_at.getFullYear() + ' ' + created_at.getHours() + ':' + created_at.getMinutes() + ':' + created_at.getSeconds();
        myProfile.updated_at = updated_at.getDate() + '-' + (updated_at.getMonth() + 1) + '-' + updated_at.getFullYear() + ' ' + updated_at.getHours() + ':' + updated_at.getMinutes() + ':' + updated_at.getSeconds();
        standardizeResponse(res, "success", 200, "Profile fetched successfully", myProfile);
    } catch (err) {
        next(createError(400, err.message));
    }
}

const getWorkerProfile = async (req, res, next) => {
    try {
        const id = req.params.id;
        const {rows:[worker]} = await selectWorkerById(id);
        if (!worker) {
            return next(createError(400, "Worker Not Found"));
        }
        const created_at = new Date(worker.created_at);
        const updated_at = new Date(worker.updated_at);
        worker.created_at = created_at.getDate() + '-' + (created_at.getMonth() + 1) + '-' + created_at.getFullYear() + ' ' + created_at.getHours() + ':' + created_at.getMinutes() + ':' + created_at.getSeconds();
        worker.updated_at = updated_at.getDate() + '-' + (updated_at.getMonth() + 1) + '-' + updated_at.getFullYear() + ' ' + updated_at.getHours() + ':' + updated_at.getMinutes() + ':' + updated_at.getSeconds();
        standardizeResponse(res, "success", 200, "Profile fetched successfully", worker);
    } catch (err) {
        next(createError(400, err.message));
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
        next(createError(400, err.message));
    }
}

module.exports = {
    registerWorker,
    getAllWorkers,
    getMyProfile,
    getWorkerProfile,
    updateWorkerProfile
}