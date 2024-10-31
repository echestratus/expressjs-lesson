const express = require('express');
const { getMySkills, getWorkerSkills, addSkill } = require('../controllers/skills');
const route = express.Router();
const {protected} = require('../middlewares/auth');

route.get('/myskills', protected, getMySkills);
route.get('/:id', protected, getWorkerSkills);
route.post('/myskills', protected, addSkill);

module.exports = {
    route
}