const express = require('express');
const route = express.Router();

const planets = require('../controller/controller-planets');

route.get('/', planets.getPlanets);

route.get('/:id_planeta', planets.getIdPlanets);

route.post('/', planets.postPlanets);

route.patch('/:id_planeta', planets.patchPlanets);

route.delete('/:id_planeta', planets.deletePlanets);

module.exports = route;
