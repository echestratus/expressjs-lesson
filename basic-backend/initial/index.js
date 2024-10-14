const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./src/configs/db');

const app = express();
const PORT = 4000;
const products = [];

app.use(bodyParser.json());

app.get('/welcome', (req, res, next) => {
    res.send("Hello World");
});

app.get('/products', async (req, res, next) => {
    const data = await pool.query('SELECT * FROM products');
    res.json({
        "status": "success",
        "message": "data fetched successfully",
        "data": data.rows
    });
});

app.post('/product', async (req, res, next) => {
    // const name = req.body.name;
    // const price = req.body.price;
    // const stock = req.body.stock;

    const {name, price, stock, description} = req.body
    
    const data = {
        name,
        price,
        stock,
        description
    }

    await pool.query("INSERT INTO products(name, price, stock, description) VALUES($1, $2, $3, $4)", [name, price, stock, description]);

    res.json({
        "status": "success",
        "message": "data sent successfully",
        "data": data
    });
});

app.put('/products/:id', async (req, res, next) => {
    const id = req.params.id;
    const {name, price, stock, description} = req.body;
    
    const getData = (await pool.query("SELECT * FROM products WHERE id=$1", [id])).rows[0];

    const data = {
        name: (name !== getData.name) && (name) ? name : getData.name,
        price: (price !== getData.price) && (price) ? price : getData.price,
        stock: (stock !== getData.stock) && (stock) ? stock : getData.stock,
        description: (description !== getData.description) && (description) ? description : getData.description
    }; 

    await pool.query("UPDATE products SET name=$1, price=$2, stock=$3, description=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5", [data.name, data.price, data.stock, data.description, id]);

    res.json({
        "status": "success",
        "message": `Data with id ${id} updated`,
        "data": data
    });
});

app.get('/products/:id', async (req, res, next) => {
    const id = req.params.id;
    const result = (await pool.query("SELECT * FROM products WHERE id=$1", [id])).rows[0];
    res.json({
        "status": "success",
        "message": `data with id ${id} fetched successfully`,
        "data": result
    });
});

app.delete('/products/:id', async (req, res, next) => {
    const id = req.params.id;
    const deletedProduct = (await pool.query("SELECT * FROM products WHERE id=$1", [id])).rows[0];
    
    await pool.query("DELETE FROM products WHERE id=$1", [id]);

    res.json({
        status: "product deleted successfully",
        deletedProduct: deletedProduct
    });
});

app.listen(PORT, () => {
    console.log(`server running in port ${PORT}`);
})