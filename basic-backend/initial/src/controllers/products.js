const { selectAllProducts, postProduct, selectProduct, updateProduct, deleteProduct } = require("../models/products");

const getAllProducts = async (req, res, next) => {
    const data = await selectAllProducts();
    res.json({
        "status": "success",
        "message": "data fetched successfully",
        "data": data.rows
    });
}

const createProduct = async (req, res, next) => {
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

    res.json({
        "status": "success",
        "message": "data sent successfully",
        "data": data
    });
}

const getProductById = async (req, res, next) => {
    const id = req.params.id;
    const result = (await selectProduct(id)).rows[0];
    res.json({
        "status": "success",
        "message": `data with id ${id} fetched successfully`,
        "data": result
    });
}

const updateProductById = async (req, res, next) => {
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

    res.json({
        "status": "success",
        "message": `Data with id ${id} updated`,
        "data": data
    });
}

const deleteProductById = async (req, res, next) => {
    const id = req.params.id;
    const deletedProduct = (await selectProduct(id)).rows[0];
    
    await deleteProduct(id);

    res.json({
        status: "product deleted successfully",
        deletedProduct: deletedProduct
    });
}

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProductById,
    deleteProductById
}