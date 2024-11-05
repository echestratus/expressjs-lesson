const {pool} = require('../configs/db');

const insertPortfolioPicture = ({id, file_url, portfolio_id}) => {
    return pool.query("INSERT INTO portfolio_picture(id, file_url, portfolio_id) VALUES($1, $2, $3)", [id, file_url, portfolio_id]);
}

const selectPortfolioPictureByPortfolioId = (portfolio_id) => {
    return pool.query("SELECT id, file_url, portfolio_id, created_at::VARCHAR(64), updated_at::VARCHAR(64) FROM portfolio_picture WHERE portfolio_id=$1", [portfolio_id]);
}

const selectPortfolioPictureById = (id) => {
    return pool.query("SELECT * FROM portfolio_picture WHERE id=$1", [id]);
}

const updatePortfolioPicture = ({id, file_url, portfolio_id}) => {
    return pool.query("UPDATE portfolio_picture SET id=$1, file_url=$2, updated_at=CURRENT_TIMESTAMP WHERE portfolio_id=$3", [id, file_url, portfolio_id]);
}

const deletePortfolioPicture = (id) => {
    return pool.query("DELETE FROM portfolio_picture WHERE id=$1", [id]);
}

module.exports = {
    insertPortfolioPicture,
    selectPortfolioPictureByPortfolioId,
    selectPortfolioPictureById,
    updatePortfolioPicture,
    deletePortfolioPicture
}