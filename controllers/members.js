// File System
const fs = require('fs');

// Dados
const data = require('../data.json');

// Cálculo de idade
const { date } = require('../utils');

// Página inicial
exports.index = function (req, res) {
    return res.render('members/index', { members: data.members });
}

// Página para criar membro
exports.create = function (req, res) {
    return res.render('members/create');
}

// Cria membro
exports.post = function (req, res) {
    // Validação dos campos
    const keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == '') {
            return res.send('Por favor, preencha todos os campos.');
        }
    }

    // Transforme a data de nascimento em timestamp
    birth = Date.parse(req.body.birth);

    // Cria o id para o usuário
    let id = 1;
    const lastMember = data.members[data.members.length - 1];
    if (lastMember) {
        id = lastMember.id + 1;
    }

    // Adiciona o req.body no array
    data.members.push({
        id,
        ...req.body,
        birth
    });

    // Escreve no arquivo data.json
    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect('members');
    });
}

// Mostra membro
exports.show = function (req, res) {
    const { id } = req.params;

    const foundMember = data.members.find(function (member) {
        return member.id == id;
    });

    if (!foundMember) {
        return res.send('Instrutor não foi encontrado.');
    }

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).birthDay
    }

    return res.render('members/show', { member });
}

// Página de edição do membro
exports.edit = function (req, res) {
    const { id } = req.params;

    const foundMember = data.members.find(function (member) {
        return member.id == id;
    });

    if (!foundMember) {
        return res.send('Instrutor não foi encontrado.');
    }

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso
    }

    return res.render('members/edit', { member });
}

// Salva as alterações do membro
exports.put = function (req, res) {
    const { id } = req.body;
    let index = 0;

    const foundMember = data.members.find(function (member, foundIndex) {
        if (id == member.id) {
            index = foundIndex;
            return true;
        }
    });

    if (!foundMember) {
        return res.send('Instrutor não foi encontrado.');
    }

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member;

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect(`/members/${id}`);
    });
}

// Deleta membro
exports.delete = function (req, res) {
    const { id } = req.body;

    const filteredMembers = data.members.filter(function (member) {
        return member.id != id;
    });

    data.members = filteredMembers;

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect('/members');
    });
}