require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routeProducts = require('./src/routes/products');
const { standardizeResponse } = require('./src/helpers/common');
const morgan = require('morgan');
const cors = require('cors');

const NUMBER = 10;
console.log(NUMBER);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/products', routeProducts);

app.get('/', (req, res, next) => {
    res.send("Hello World");
});

app.use((err, req, res, next) => {
    standardizeResponse(res, "failed", err.status, err.message, "No data due to error(s)");
})

app.listen(process.env.BE_PORT, () => {
    console.log(`server running in port ${process.env.BE_PORT}`);
})