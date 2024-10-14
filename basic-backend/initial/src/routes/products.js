const express = require('express');
const { getAllProducts, createProduct, getProductById, updateProductById, deleteProductById } = require('../controllers/products');
const route = express.Router();

route.get('/', getAllProducts);
route.post('/', createProduct);
route.get('/:id', getProductById);
route.put('/:id', updateProductById);
route.delete('/:id', deleteProductById);

module.exports = route