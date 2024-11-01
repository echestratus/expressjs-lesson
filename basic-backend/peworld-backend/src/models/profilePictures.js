const {pool} = require('../configs/db');

const selectProfilePictureByWorkerId = (worker_id) => {
    return pool.query("SELECT id, file_url, worker_id, created_at::VARCHAR(64), updated_at::VARCHAR(64) FROM profile_pictures WHERE worker_id=$1", [worker_id]);
}

const insertProfilePicture = ({id, file_url, worker_id}) => {
    return pool.query("INSERT INTO profile_pictures(id, file_url, worker_id) VALUES($1, $2, $3)", [id, file_url, worker_id]);
}

const updateProfilePicture = ({id, file_url, worker_id}) => {
    return pool.query("UPDATE profile_pictures SET id=$1, file_url=$2, updated_at=CURRENT_TIMESTAMP WHERE worker_id=$3", [id, file_url, worker_id]);
}

module.exports = {
    selectProfilePictureByWorkerId,
    insertProfilePicture,
    updateProfilePicture
}