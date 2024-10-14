const express = require('express');
const bodyParser = require('body-parser');
const routeProducts = require('./src/routes/products');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.use('/products', routeProducts);

app.get('/', (req, res, next) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`server running in port ${PORT}`);
})