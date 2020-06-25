// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa os controllers
const instructors = require('./app/controllers/instructors');
const members = require('./app/controllers/members');

// Rota inicial
routes.get('/', function (req, res) {
    return res.redirect('/instructors');
});

// Rotas instrutores
routes.get('/instructors', instructors.index);
routes.get('/instructors/create', instructors.create);
routes.get('/instructors/:id', instructors.show);
routes.get('/instructors/:id/edit', instructors.edit);
routes.post('/instructors', instructors.post);
routes.put('/instructors', instructors.put);
routes.delete('/instructors', instructors.delete);

// Rotas membros
routes.get('/members', members.index);
routes.get('/members/create', members.create);
routes.get('/members/:id', members.show);
routes.get('/members/:id/edit', members.edit);
routes.post('/members', members.post);
routes.put('/members', members.put);
routes.delete('/members', members.delete);

// Exporta o arquivo
module.exports = routes;