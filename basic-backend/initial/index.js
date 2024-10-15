require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routeProducts = require('./src/routes/products');

const app = express();

app.use(bodyParser.json());

app.use('/products', routeProducts);

app.get('/', (req, res, next) => {
    res.send("Hello World");
});

app.listen(process.env.BE_PORT, () => {
    console.log(`server running in port ${process.env.BE_PORT}`);
})