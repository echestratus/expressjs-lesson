const pool = require('../configs/db');

const selectAllProducts = () => {
    return pool.query('SELECT * FROM products');
}

const postProduct = ({name, price, stock, description}) => {
    return pool.query("INSERT INTO products(name, price, stock, description) VALUES($1, $2, $3, $4)", [name, price, stock, description]);
}

const selectProduct = (id) => {
    return pool.query("SELECT * FROM products WHERE id=$1", [id]);
}

const updateProduct = (data, id) => {
    return pool.query("UPDATE products SET name=$1, price=$2, stock=$3, description=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5", [data.name, data.price, data.stock, data.description, id]);
}

const deleteProduct = (id) => {
    return pool.query("DELETE FROM products WHERE id=$1", [id]);
}

module.exports = {
    selectAllProducts,
    postProduct,
    selectProduct,
    updateProduct,
    deleteProduct
}

