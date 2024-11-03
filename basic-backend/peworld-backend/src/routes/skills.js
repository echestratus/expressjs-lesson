const express = require('express');
const { getMySkills, getWorkerSkills, addSkill, deleteWorkerSkill } = require('../controllers/skills');
const route = express.Router();
const {protected} = require('../middlewares/auth');

route.get('/myskills', protected, getMySkills);
route.get('/:id', protected, getWorkerSkills);
route.post('/myskills', protected, addSkill);
route.delete('/myskills', protected, deleteWorkerSkill);

module.exports = {
    route
}