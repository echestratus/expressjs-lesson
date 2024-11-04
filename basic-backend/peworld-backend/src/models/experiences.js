const {pool} = require('../configs/db');

const insertExperience = ({id, position, company, start_date, description, worker_id}) => {
    return pool.query("INSERT INTO work_experiences(id, position, company, start_date, description, worker_id) VALUES($1, $2, $3, $4, $5, $6)", [id, position, company, start_date, description, worker_id]);
}

const selectExperiencesByWorkerId = (worker_id) => {
    return pool.query("SELECT id, position, company, start_date::VARCHAR(64), description, worker_id, created_at::VARCHAR(64), updated_at::VARCHAR(64) FROM work_experiences WHERE worker_id=$1", [worker_id]);
}

const selectExperienceByIdAndWorkerId = (id, worker_id) => {
    return pool.query("SELECT id, position, company, start_date::VARCHAR(64), description, worker_id, created_at::VARCHAR(64), updated_at::VARCHAR(64) FROM work_experiences WHERE id=$1 AND worker_id=$2", [id, worker_id]);
}

const updateExperience = ({position, company, start_date, description, id, worker_id}) => {
    return pool.query("UPDATE work_experiences SET position=$1, company=$2, start_date=$3, description=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 AND worker_id=$6", [position, company, start_date, description, id, worker_id]);
}

module.exports = {
    insertExperience,
    selectExperiencesByWorkerId,
    selectExperienceByIdAndWorkerId,
    updateExperience
}