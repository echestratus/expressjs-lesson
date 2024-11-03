require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const {route: routeWorkers} = require('./src/routes/workers');
const {route: routeUsers} = require('./src/routes/users');
const {route: routeSkills} = require('./src/routes/skills');
const {route: routeUpload} = require('./src/routes/upload');
const {route: routeExperiences} = require('./src/routes/experiences');
const {route: routePortfolios} = require('./src/routes/portfolios')
const morgan = require('morgan');
const cors = require('cors');
const { standardizeResponse } = require('./src/helpers/common');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/workers', routeWorkers);
app.use('/users', routeUsers);
app.use('/skills', routeSkills);
app.use('/upload', routeUpload);
app.use('/experiences', routeExperiences);
app.use('/portfolios', routePortfolios);

app.use('/file', express.static(path.join(__dirname, '/upload')));

app.use((err, req, res, next) => {
    standardizeResponse(res, "failed", err.status, err.message, err.details);
});

app.listen(process.env.API_PORT, () => {
    console.log(`server running on port ${process.env.API_PORT}`);
});
