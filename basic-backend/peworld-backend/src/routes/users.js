const express = require('express');
const route = express.Router();
const {login} = require('../controllers/users');

route.post('/login', login);

module.exports = {
    route
}