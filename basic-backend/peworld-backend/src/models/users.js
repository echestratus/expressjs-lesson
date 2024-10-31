const {pool} = require('../configs/db');

const createUser = ({id, email, password, role}) => {
    return pool.query("INSERT INTO users(id, email, password, role) VALUES($1, $2, $3, $4)", [id, email, password, role]);
}

const selectByEmail = (email) => {
    return pool.query("SELECT workers.id, users.email, users.password, users.role, workers.name, workers.phone, workers.job_desk, workers.domicile, workers.workplace, workers.description, workers.user_id AS user_id, workers.created_at, workers.updated_at FROM workers INNER JOIN users ON workers.user_id=users.id WHERE users.email=$1", [email]);
}

module.exports = {
    createUser,
    selectByEmail
};