const createHttpError = require("http-errors");
const {v4:uuidv4} = require('uuid');
const {standardizeResponse, deleteLocalFile} = require('../helpers/common');
const {insertPortfolio, selectPortfoliosByWorkerId, selectPortfolioByIdAndWorkerId} = require('../models/portfolios');
const { selectWorkerById } = require("../models/workers");
const {insertPortfolioPicture, selectPortfolioPictureByPortfolioId, updatePortfolioPicture} = require('../models/portfolioPicture');
const { deleteFileInCloudinary } = require("../helpers/cloudinary");

const addPortfolio = async (req, res, next) => {
    try {
        const {application_name, repo_link, portfolio_type} = req.body;
        
        //Validate portfolio type
        if (portfolio_type.toLowerCase() !== "Mobile Application".toLowerCase() && portfolio_type.toLowerCase() !== "Web Application".toLowerCase()) {
            return next(createHttpError(406, "Portfolio type value could only either Mobile Application or Web Application"));
        }
    
        const data = {
            id: uuidv4(),
            application_name,
            repo_link,
            portfolio_type,
            worker_id: req.decoded.data.id
        }
        await insertPortfolio(data);
    
        standardizeResponse(res, "success", 201, "Portfolio added successfully", data);
    } catch (err) {
        console.log(err);
        next(createHttpError(400, err.message));
    }
}

const getPortfolios = async (req, res, next) => {
    try {
        const worker_id = req.decoded.data.id;
        const {rows:data} = await selectPortfoliosByWorkerId(worker_id);
        for (const index in data) {
            data[index].portfolio_picture = (await selectPortfolioPictureByPortfolioId(data[index].id)).rows[0] || null;
        }
        standardizeResponse(res, "success", 200, "Portfolios fetched successfully", data);
    } catch (err) {
        console.log(err);
        next(createHttpError(400, err.message));
    }
}

const getWorkerPortfolios = async (req, res, next) => {
    try {
        const worker_id = req.params.id;
        const {rows: [worker]} = await selectWorkerById(worker_id);
        if (!worker) {
            return next(createHttpError(404, "Worker Not Found"));
        }
        const {rows:data} = await selectPortfoliosByWorkerId(worker_id);
        for (const index in data) {
            data[index].portfolio_picture = (await selectPortfolioPictureByPortfolioId(data[index].id)).rows[0] || null;
        }
        standardizeResponse(res, "success", 200, "Portfolios fetched successfully", data);
    } catch (err) {
        console.log(err);
        next(createHttpError(400, err.message));
    }
}

const updateOrAddPortfolioPicture = async (req, res, next) => {
    try {
        //Delete uploaded file
        deleteLocalFile(req.file.path, next);

        const portfolio_id = req.params.portfolio_id;

        const {rows:[portfolio]} = await selectPortfolioByIdAndWorkerId(portfolio_id, req.decoded.data.id);
        console.log(portfolio);
        if (!portfolio) {
            deleteFileInCloudinary(req.cloudinaryAsset.public_id);
            return next(createHttpError(404, "Portfolio Not Found"));
        }

        const {rows:[portfolioPicture]} = await selectPortfolioPictureByPortfolioId(portfolio_id)
        if (!portfolioPicture) {
            //Post new portfolio picture
            const data = {
                id: req.cloudinaryAsset.public_id,
                file_url: req.cloudinaryAsset.url,
                portfolio_id
            }
            await insertPortfolioPicture(data);
            standardizeResponse(res, "success", 201, "Portfolio picture added successfully", data);
        } else {
            //Update profile picture
            deleteFileInCloudinary(portfolioPicture.id);
            const data = {
                id: req.cloudinaryAsset.public_id,
                file_url: req.cloudinaryAsset.url,
                portfolio_id
            }
            await updatePortfolioPicture(data);
            standardizeResponse(res, "success", 200, "Portfolio picture updated successfully", data);
        }  
    } catch (err) {
        console.log(err);
        deleteFileInCloudinary(req.cloudinaryAsset.public_id);
        next(createHttpError(400, err.message));
    }
}

module.exports = {
    addPortfolio,
    getPortfolios,
    getWorkerPortfolios,
    updateOrAddPortfolioPicture
}