// Utils
const { age, date } = require('../../lib/utils');

// Importa o modelo
const Instructor = require('../models/Instructor');

module.exports = {
    // Página inicial
    index(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 2;
        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(instructors) {
                const pagination = {
                    // ceil arredonda o cálculo para cima
                    total: Math.ceil(instructors[0].total / limit),
                    page
                }

                return res.render('instructors/index', { instructors, pagination, filter });
            }
        }

        Instructor.paginate(params);
    },
    // Página para criar membro
    create(req, res) {
        return res.render('instructors/create');
    },
    // Cria instrutor
    post(req, res) {
        // Validação dos campos
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        Instructor.create(req.body, function (instructor) {
            return res.redirect(`/instructors/${instructor.id}`);
        });
    },
    // Mostra instrutor
    show(req, res) {
        Instructor.find(req.params.id, function (instructor) {
            // Se não tiver um instrutor
            if (!instructor) {
                return res.send('Instrutor não foi encontrado.');
            }

            instructor.age = age(instructor.birth);
            instructor.services = instructor.services.split(',');
            instructor.created_at = date(instructor.created_at).format;

            return res.render('instructors/show', { instructor });
        });
    },
    // Página de edição do instrutor
    edit(req, res) {
        Instructor.find(req.params.id, function (instructor) {
            // Se não tiver um instrutor
            if (!instructor) {
                return res.send('Instrutor não foi encontrado.');
            }

            instructor.birth = date(instructor.birth).iso;

            return res.render('instructors/edit', { instructor });
        });
    },
    // Salva as alterações do instrutor
    put(req, res) {
        // Validação dos campos
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        Instructor.update(req.body, function () {
            return res.redirect(`/instructors/${req.body.id}`);
        });
    },
    // Deleta instrutor
    delete(req, res) {
        Instructor.delete(req.body.id, function () {
            return res.redirect(`/instructors`);
        });
    }
};