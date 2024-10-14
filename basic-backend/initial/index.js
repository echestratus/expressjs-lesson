const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;
const products = [];

app.use(bodyParser.json());

app.get('/welcome', (req, res, next) => {
    res.send("Hello World");
});

app.get('/products', (req, res, next) => {
    res.json({
        "status": "success",
        "data": products
    });
});

app.post('/product', (req, res, next) => {
    // const name = req.body.name;
    // const price = req.body.price;
    // const stock = req.body.stock;

    const {id, name, price, stock} = req.body
    
    const data = {
        id,
        name,
        price,
        stock
    }
    products.push(data);

    res.json({
        "status": "sent successfully",
        "data": data
    });
});

app.delete('/product/:id', (req, res, next) => {
    const id = req.params.id;
    const deletedProduct = products.filter(product => Number(id) === product.id);
    const index = products.indexOf(deletedProduct);
    
    products.splice(index, 1);

    res.json({
        status: "product deleted successfully",
        deletedProduct: deletedProduct
    });
});

app.listen(PORT, () => {
    console.log(`server running in port ${PORT}`);
})