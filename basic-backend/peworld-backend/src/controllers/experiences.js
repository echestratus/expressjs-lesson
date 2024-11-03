const createHttpError = require('http-errors');
const {v4: uuidv4} = require('uuid');
const {standardizeResponse, deleteLocalFile} = require('../helpers/common');
const {insertExperience, selectExperiencesByWorkerId, selectExperienceByIdAndWorkerId} = require('../models/experiences');
const {insertCompanyLogo, selectCompanyLogoByWorkExperienceId, updateCompanyLogo} = require('../models/experienceCompanyLogo');
const { deleteFileInCloudinary } = require('../helpers/cloudinary');
const { selectWorkerById } = require('../models/workers');

const addWorkExperience = async (req, res, next) => {
    try {
        const {position, company, start_date, description} = req.body;
        const startDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i;
        if (!startDateRegex.test(start_date)) {
            return next(createHttpError(406, "Error Validation", {details: "start_date format should be YYYY-MM-DD"}));
        }
        const data = {
            id: uuidv4(),
            position,
            company,
            start_date,
            description,
            worker_id: req.decoded.data.id
        }
        await insertExperience(data);
        standardizeResponse(res, "success", 201, "Work experience added", data);
    } catch (err) {
        console.log(err);
        next(createHttpError(400, err.message));
    }
}

const getWorkExperiences = async (req, res, next) => {
    try {
        const {rows: data} = await selectExperiencesByWorkerId(req.decoded.data.id);
        if (data.length !== 0) {
            for (const index in data) {
                data[index].company_logo = (await selectCompanyLogoByWorkExperienceId(data[index].id)).rows[0] || null;
            }
        }
        standardizeResponse(res, "success", 200, "Work experiences fetched successfully", data);
    } catch (err) {
        console.log(err);
        next(createHttpError(400, err.message));
    }
}

const getWorkerWorkExperiences = async (req, res, next) => {
    try {
        const id = req.params.id;
        const {rows:[worker]} = await selectWorkerById(id);
        if (!worker) {
            return next(createHttpError(404, "Worker Not Found"));
        }
        const {rows: data} = await selectExperiencesByWorkerId(id);
        if (data.length !== 0) {
            for (const index in data) {
                data[index].company_logo = (await selectCompanyLogoByWorkExperienceId(data[index].id)).rows[0] || null;
            }
        }
        standardizeResponse(res, "success", 200, "Work experiences fetched successfully", data);
    } catch (err) {
        next(createHttpError(400, err.message));
    }
}

const updateOrAddCompanyLogo = async (req, res, next) => {
    try {
        //Delete uploaded file
        deleteLocalFile(req.file.path, next);
        
        const experience_id = req.params.experience_id;
        
        const {rows:[experience]} = await selectExperienceByIdAndWorkerId(experience_id, req.decoded.data.id);
        if (!experience) {
            deleteFileInCloudinary(req.cloudinaryAsset.public_id);
            return next(createHttpError(404, "Experience Not Found"))
        }

        const {rows:[company_logo]} = await selectCompanyLogoByWorkExperienceId(experience_id);
        if (!company_logo) {
            //Post new company_logo
            const data = {
                id: req.cloudinaryAsset.public_id,
                file_url: req.cloudinaryAsset.url,
                experience_id
            }
            await insertCompanyLogo(data);
            standardizeResponse(res, "success", 201, "Company logo for experience added successfully", data);
        } else {
            //Update company_logo
            deleteFileInCloudinary(company_logo.id);
            const data = {
                id: req.cloudinaryAsset.public_id,
                file_url: req.cloudinaryAsset.url,
                experience_id
            }
            await updateCompanyLogo(data);
            standardizeResponse(res, "success", 200, "Company logo for experience updated", data);
        }
    } catch (err) {
        console.log(err);
        deleteFileInCloudinary(req.cloudinaryAsset.public_id);
        next(createHttpError(400, err.message));
    }
}

module.exports = {
    addWorkExperience,
    getWorkExperiences,
    getWorkerWorkExperiences,
    updateOrAddCompanyLogo
}