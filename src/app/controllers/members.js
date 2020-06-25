// Cálculo de idade
const { age, date } = require('../../lib/utils');

// Importa o modelo
const Member = require('../models/Member');

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
            callback(members) {
                const pagination = {
                    // ceil arredonda o cálculo para cima
                    total: Math.ceil(members[0].total / limit),
                    page
                }

                return res.render('members/index', { members, pagination, filter });
            }
        }

        Member.paginate(params);
    },
    // Página para criar membro
    create(req, res) {
        Member.instructorsSelectOptions(function (options) {
            return res.render('members/create', { instructorOptions: options });
        });
    },
    // Cria membro
    post(req, res) {
        // Validação dos campos
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        Member.create(req.body, function (member) {
            return res.redirect(`/members/${member.id}`);
        });
    },
    // Mostra membro
    show(req, res) {
        Member.find(req.params.id, function (member) {
            // Se não tiver um membro
            if (!member) {
                return res.send('Instrutor não foi encontrado.');
            }

            member.birth = date(member.birth).birthDay;

            return res.render('members/show', { member });
        });
    },
    // Página de edição do membro
    edit(req, res) {
        Member.find(req.params.id, function (member) {
            // Se não tiver um membro
            if (!member) {
                return res.send('Instrutor não foi encontrado.');
            }

            member.birth = date(member.birth).iso;

            Member.instructorsSelectOptions(function (options) {
                return res.render('members/edit', { member, instructorOptions: options });
            });
        });
    },
    // Salva as alterações do membro
    put(req, res) {
        // Validação dos campos
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        Member.update(req.body, function () {
            return res.redirect(`/members/${req.body.id}`);
        });
    },
    // Deleta membro
    delete(req, res) {
        Member.delete(req.body.id, function () {
            return res.redirect(`/members`);
        });
    }
};