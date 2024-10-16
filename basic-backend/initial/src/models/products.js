const pool = require('../configs/db');

const selectAllProducts = (limit, offset, sortBy, sort, search) => {
    if (search) {
        return pool.query(`SELECT * FROM products WHERE name ILIKE '%${search}%' ORDER BY ${sortBy} ${sort} LIMIT $1 OFFSET $2`, [limit, offset]);
    } else {
        return pool.query(`SELECT * FROM products ORDER BY ${sortBy} ${sort} LIMIT $1 OFFSET $2`, [limit, offset]);
    }
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

const totalProducts = () => {
    return pool.query("SELECT COUNT(*) FROM products");
}

module.exports = {
    selectAllProducts,
    postProduct,
    selectProduct,
    updateProduct,
    deleteProduct,
    totalProducts
}

