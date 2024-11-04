const {pool} = require('../configs/db');

const selectCompanyLogoByWorkExperienceId = (experience_id) => {
    return pool.query("SELECT id, file_url, experience_id, created_at::VARCHAR(64), updated_at::VARCHAR(64) FROM experience_company_logo WHERE experience_id=$1", [experience_id]);
}

const insertCompanyLogo = ({id, file_url, experience_id}) => {
    return pool.query("INSERT INTO experience_company_logo(id, file_url, experience_id) VALUES($1, $2, $3)", [id, file_url, experience_id]);
}

const updateCompanyLogo = ({id, file_url, experience_id}) => {
    return pool.query("UPDATE experience_company_logo SET id=$1, file_url=$2, updated_at=CURRENT_TIMESTAMP WHERE experience_id=$3", [id, file_url, experience_id]);
}

const deleteCompanyLogo = (experience_id) => {
    return pool.query("DELETE FROM experience_company_logo WHERE experience_id=$1", [experience_id]);
}

module.exports = {
    selectCompanyLogoByWorkExperienceId,
    insertCompanyLogo,
    updateCompanyLogo,
    deleteCompanyLogo
}