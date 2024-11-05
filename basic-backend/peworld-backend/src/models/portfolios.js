const {pool} = require('../configs/db');

const insertPortfolio = ({id, application_name, repo_link, portfolio_type, worker_id}) => {
    return pool.query("INSERT INTO portfolios(id, application_name, repo_link, portfolio_type, worker_id) VALUES($1, $2, $3, $4, $5)", [id, application_name, repo_link, portfolio_type, worker_id]);
}

const selectPortfoliosByWorkerId = (worker_id) => {
    return pool.query("SELECT id, application_name, repo_link, portfolio_type, worker_id, created_at::VARCHAR(64), updated_at::VARCHAR(64) FROM portfolios WHERE worker_id=$1", [worker_id]);
}

const selectPortfolioByIdAndWorkerId = (id, worker_id) => {
    return pool.query("SELECT * FROM portfolios WHERE id=$1 AND worker_id=$2", [id, worker_id]);
}

const updatePortfolio = ({application_name, repo_link, portfolio_type, id}) => {
    return pool.query("UPDATE portfolios SET application_name=$1, repo_link=$2, portfolio_type=$3, updated_at=CURRENT_TIMESTAMP WHERE id=$4", [application_name, repo_link, portfolio_type, id]);
}

const deletePortfolio = (id, worker_id) => {
    return pool.query("DELETE FROM portfolios WHERE id=$1 AND worker_id=$2", [id, worker_id])
}

module.exports = {
    insertPortfolio,
    selectPortfoliosByWorkerId,
    selectPortfolioByIdAndWorkerId,
    deletePortfolio,
    updatePortfolio
}