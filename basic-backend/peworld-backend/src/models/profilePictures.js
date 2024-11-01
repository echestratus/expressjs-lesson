const {pool} = require('../configs/db');

const selectProfilePictureByWorkerId = (worker_id) => {
    return pool.query("SELECT * FROM profile_pictures WHERE worker_id=$1", [worker_id]);
}

module.exports = {
    selectProfilePictureByWorkerId
}