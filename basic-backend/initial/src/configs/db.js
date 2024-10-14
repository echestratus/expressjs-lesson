const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    port: '5432',
    database: 'basicbackend'
});

module.exports = pool;


