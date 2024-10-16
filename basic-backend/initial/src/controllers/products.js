const { selectAllProducts, postProduct, selectProduct, updateProduct, deleteProduct, totalProducts } = require("../models/products");
const { standardizeResponse } = require('../helpers/common');
const createError = require('http-errors');

const getAllProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const offset = (page - 1) * limit;
        const sortBy = req.query.sortBy || "created_at";
        const sort = req.query.sort || "ASC";
        const search = req.query.search || "";
        const data = await selectAllProducts(limit, offset, sortBy, sort, search);
        const totalData = parseInt((await totalProducts()).rows[0].count);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = {
            page,
            limit,
            offset,
            sortBy,
            sort,
            totalData,
            totalPage
        }
        // res.json({
        //     "status": "success",
        //     "message": "data fetched successfully",
        //     "data": data.rows
        // });
        standardizeResponse(res, "success", 200, "data fetched successfully",data.rows, pagination);
    } catch (err) {
        console.log(err);
        next(createError.InternalServerError());
    }
}

const createProduct = async (req, res, next) => {
    try {
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
    
        await postProduct(data);
    
        // res.json({
        //     "status": "success",
        //     "message": "data sent successfully",
        //     "data": data
        // });
        standardizeResponse(res, "success", 201, "data sent successfully", data);
    } catch (err) {
        console.log(err);
        next(createError(406, err.message));
    }
}

const getProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = (await selectProduct(id)).rows[0];
        if (!result) {
            next(createError(404, "Data Not Found"));
            return;
        }
        // res.json({
        //     "status": "success",
        //     "message": `data with id ${id} fetched successfully`,
        //     "data": result
        // });
        standardizeResponse(res, "success", 200, `data with id ${id} fetched successfully`, result);
    } catch (err) {
        console.log(err);
        next(createError.InternalServerError());
    }
}

const updateProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const {name, price, stock, description} = req.body;
        
        const getData = (await selectProduct(id)).rows[0];
    
        const data = {
            name: (name !== getData.name) && (name) ? name : getData.name,
            price: (price !== getData.price) && (price) ? price : getData.price,
            stock: (stock !== getData.stock) && (stock) ? stock : getData.stock,
            description: (description !== getData.description) && (description) ? description : getData.description
        }; 
    
        await updateProduct(data, id);
    
        // res.json({
        //     "status": "success",
        //     "message": `Data with id ${id} updated`,
        //     "data": data
        // });
        standardizeResponse(res, "success", 201, `Data with id ${id} updated`, data);
    } catch (err) {
        console.log(err);
        next(createError(406, err.message));
    }
}

const deleteProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedProduct = (await selectProduct(id)).rows[0];

        if (!deletedProduct) {
            next(createError(404, `Data Not Found`));
            return;
        }
        
        await deleteProduct(id);
    
        // res.json({
        //     status: "product deleted successfully",
        //     deletedProduct: deletedProduct
        // });
        standardizeResponse(res, "success", 200, `product with id ${id} deleted successfully`, deletedProduct);
    } catch (err) {
        console.log(err);
        next(createError.InternalServerError());
    }
}

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProductById,
    deleteProductById
}