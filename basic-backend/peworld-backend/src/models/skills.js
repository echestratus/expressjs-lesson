const {pool} = require('../configs/db');

const insertSkill = ({id, skill_name, worker_id}) => {
    return pool.query("INSERT INTO skills(id, skill_name, worker_id) VALUES($1, $2, $3)", [id, skill_name, worker_id]);
}

const findSkillPerWorker = (skill_name, worker_id) => {
    return pool.query("SELECT * FROM skills WHERE skill_name=$1 AND worker_id=$2", [skill_name, worker_id]);
}

const selectSkillsByWorkerId = (worker_id) => {
    return pool.query("SELECT * FROM skills WHERE worker_id=$1", [worker_id]);
}

const deleteSkillByNameAndWorkerId = (skill_name, worker_id) => {
    return pool.query("DELETE FROM skills WHERE skill_name=$1 AND worker_id=$2", [skill_name, worker_id]);
}

module.exports = {
    insertSkill,
    findSkillPerWorker,
    selectSkillsByWorkerId,
    deleteSkillByNameAndWorkerId
}