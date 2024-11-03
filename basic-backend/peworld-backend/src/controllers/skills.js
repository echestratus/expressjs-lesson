const createHttpError = require('http-errors');
const {standardizeResponse} = require('../helpers/common');
const {v4: uuidv4} = require('uuid');
const {findSkillPerWorker, insertSkill, selectSkillsByWorkerId, deleteSkillByNameAndWorkerId} = require('../models/skills');

const addSkill = async (req, res, next) => {
    try {
        const {skill_name} = req.body;
        const data = {
            id: uuidv4(),
            skill_name,
            worker_id: req.decoded.data.id
        }
        const {rows: findDuplicateSkill} = await findSkillPerWorker(skill_name, data.worker_id); 
        if (findDuplicateSkill.length !== 0) {
            return next(createHttpError(400, "Skills already in your list"));
        }
    
        await insertSkill(data);
    
        standardizeResponse(res, "success", 200, "Skill added successfully", data);
    } catch (err) {
        next(createHttpError(400, err.message));
    }
}

const getMySkills = async (req, res, next) => {
    try {
        const worker_id = req.decoded.data.id;
        const {rows:data} = await selectSkillsByWorkerId(worker_id);
        standardizeResponse(res, "success", 200, "Skills fetched successfully", data);
    } catch (err) {
        next(createHttpError.InternalServerError());
    }
}

const getWorkerSkills = async (req, res, next) => {
    try {
        const worker_id = req.params.id;
        const {rows:data} = await selectSkillsByWorkerId(worker_id);
        standardizeResponse(res, "success", 200, "Skills fetched successfully", data);
    } catch (err) {
        next(createHttpError.InternalServerError());
    }
}

const deleteWorkerSkill = async (req, res, next) => {
    try {
        const {skill_name} = req.body;
        const worker_id = req.decoded.data.id;
        const {rows:[skillFound]} = await findSkillPerWorker(skill_name, worker_id);
        if (!skillFound) {
            return next(createHttpError(404, "Skill Not Found"));
        }
        await deleteSkillByNameAndWorkerId(skill_name, worker_id);
        standardizeResponse(res, "success", 200, "Skill deleted successfully", skillFound);
    } catch (err) {
        console.log(err);
        next(createHttpError(400, err.message));
    }
}

module.exports = {
    addSkill,
    getMySkills,
    getWorkerSkills,
    deleteWorkerSkill
}