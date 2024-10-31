const {pool} = require('../configs/db');

const createWorker = ({id, name, phone, user_id}) => {
    return pool.query("INSERT INTO workers(id, name, phone, user_id) VALUES($1, $2, $3, $4)", [id, name, phone, user_id]);
}

const selectAllWorkers = (orderBy, order, limit, offset, search) => {
    if (search) {
        return pool.query(`SELECT workers.id, users.email, users.role, workers.name, workers.phone, workers.job_desk, workers.domicile, workers.workplace, workers.description, workers.user_id AS user_id, workers.created_at::VARCHAR(64), workers.updated_at::VARCHAR(64) FROM workers INNER JOIN users ON workers.user_id=users.id WHERE workers.name ILIKE '%${search}%' ORDER BY ${orderBy} ${order} LIMIT ${limit} OFFSET ${offset}`);
    } else {
        return pool.query(`SELECT workers.id, users.email, users.role, workers.name, workers.phone, workers.job_desk, workers.domicile, workers.workplace, workers.description, workers.user_id AS user_id, workers.created_at::VARCHAR(64), workers.updated_at::VARCHAR(64) FROM workers INNER JOIN users ON workers.user_id=users.id ORDER BY ${orderBy} ${order} LIMIT ${limit} OFFSET ${offset}`);
    }
}

const totalWorkers = () => {
    return pool.query("SELECT COUNT(*) FROM workers");
}

const selectWorkerById = (id) => {
    return pool.query("SELECT workers.id, users.email, users.role, workers.name, workers.phone, workers.job_desk, workers.domicile, workers.workplace, workers.description, workers.user_id AS user_id, workers.created_at, workers.updated_at FROM workers INNER JOIN users ON workers.user_id=users.id WHERE workers.id=$1", [id]);
}

const updateWorker = ({id, name, job_desk, domicile, workplace, description, phone}) => {
    return pool.query("UPDATE workers SET name=$1, job_desk=$2, domicile=$3, workplace=$4, description=$5, phone=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7", [name, job_desk, domicile, workplace, description, phone, id]);
}

module.exports = {
    createWorker,
    selectAllWorkers,
    selectWorkerById,
    updateWorker,
    totalWorkers
};