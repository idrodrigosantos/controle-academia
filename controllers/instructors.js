// File System
const fs = require('fs');

// Dados
const data = require('../data.json');

// Cálculo de idade
const { age, date } = require('../utils');

// Formato de data pt-BR
const Intl = require('intl');

// Página inicial
exports.index = function (req, res) {
    return res.render('instructors/index', { instructors: data.instructors });
}

// Página para criar membro
exports.create = function (req, res) {
    return res.render('instructors/create');
}

// Cria instrutor
exports.post = function (req, res) {
    // Validação dos campos
    const keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == '') {
            return res.send('Por favor, preencha todos os campos.');
        }
    }

    // Desestruturação do req.body
    let { avatar_url, name, birth, gender, services } = req.body;

    // Transforme a data de nascimento em timestamp
    birth = Date.parse(birth);

    // No momento do cadastro cria a data no formato timestamp
    const created_at = Date.now();

    // Cria o id para o usuário
    const id = Number(data.instructors.length + 1);

    // Adiciona o req.body no array
    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    });

    // Escreve no arquivo data.json
    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect('instructors');
    });
}

// Mostra instrutor
exports.show = function (req, res) {
    const { id } = req.params;

    const foundInstructor = data.instructors.find(function (instructor) {
        return instructor.id == id;
    });

    if (!foundInstructor) {
        return res.send('Instrutor não foi encontrado.');
    }

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        // .split() transforma a string em um array quando encontar algo (neste caso a vírgula)
        services: foundInstructor.services.split(','),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at)
    }

    return res.render('instructors/show', { instructor });
}

// Página de edição do instrutor
exports.edit = function (req, res) {
    const { id } = req.params;

    const foundInstructor = data.instructors.find(function (instructor) {
        return instructor.id == id;
    });

    if (!foundInstructor) {
        return res.send('Instrutor não foi encontrado.');
    }

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
    }

    return res.render('instructors/edit', { instructor });
}

// Salva as alterações do instrutor
exports.put = function (req, res) {
    const { id } = req.body;
    let index = 0;

    const foundInstructor = data.instructors.find(function (instructor, foundIndex) {
        if (id == instructor.id) {
            index = foundIndex;
            return true;
        }
    });

    if (!foundInstructor) {
        return res.send('Instrutor não foi encontrado.');
    }

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor;

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect(`/instructors/${id}`);
    });
}

// Deleta instrutor
exports.delete = function (req, res) {
    const { id } = req.body;

    const filteredInstructors = data.instructors.filter(function (instructor) {
        return instructor.id != id;
    });

    data.instructors = filteredInstructors;

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect('/instructors');
    });
}