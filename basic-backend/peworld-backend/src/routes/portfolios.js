const express = require('express');
const route = express.Router();
const {protected} = require('../middlewares/auth')
const {addPortfolio, getPortfolios, getWorkerPortfolios, updateOrAddPortfolioPicture, removePortfolioPicture, removePortfolio, updateWorkerPortfolio} = require('../controllers/portfolios');
const { upload } = require('../middlewares/upload');
const { uploadToCloudinary } = require('../middlewares/cloudinary');

route.post('/', protected, addPortfolio);
route.get('/', protected, getPortfolios);
route.get('/:id', protected, getWorkerPortfolios);
route.put('/portfolio-picture/:portfolio_id', protected, upload.single('image'), uploadToCloudinary, updateOrAddPortfolioPicture);
route.delete('/portfolio-picture/:portfolio_picture_id', protected, removePortfolioPicture);
route.delete('/:portfolio_id', protected, removePortfolio);
route.put('/:portfolio_id', protected, updateWorkerPortfolio);

module.exports = {
    route
}