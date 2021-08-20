const express = require('express');
const route = express.Router();
const upload = require('../middleware/upload')
const planets = require('../controller/controller-planets');


route.get('/', planets.getPlanets);

route.get('/:id_planeta', planets.getIdPlanets);

route.post('/', upload('./img/planetas', 'image/webp' , (1024 * 1024) / 2).single('foto'), planets.postPlanets);

route.patch('/:id_planeta', upload('./img/planetas', 'image/webp' , (1024 * 1024) / 2).single('foto'), planets.patchPlanets);

route.delete('/:id_planeta', planets.deletePlanets);

module.exports = route;
