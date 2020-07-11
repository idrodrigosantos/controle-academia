// Utils
const { date } = require('../../lib/utils');

// Importa a conexão com o banco de dados
const db = require('../../config/db');

module.exports = {
    // Seleciona todos os instrutores
    all(callback) {
        db.query(`SELECT instructors.*, COUNT (members) AS total_students
            FROM instructors LEFT JOIN members ON (instructors.id = members.instructor_id)
            GROUP BY instructors.id ORDER BY total_students DESC`, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows);
        });
    },
    // Cadastra instrutor
    create(data, callback) {
        const query = `
            INSERT INTO instructors(
                name,
                avatar_url,
                gender,
                services,
                birth,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;

        const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.services,
            date(data.birth).iso,
            date(Date.now()).iso
        ];

        db.query(query, values, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows[0]);
        });
    },
    // Encontra um instrutor
    find(id, callback) {
        db.query('SELECT * FROM instructors WHERE id = $1', [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows[0]);
        });
    },
    findBy(filter, callback) {
        db.query(`SELECT instructors.*, COUNT (members) AS total_students
            FROM instructors LEFT JOIN members ON (instructors.id = members.instructor_id)
            WHERE instructors.name ILIKE '%${filter}%'
            OR instructors.services ILIKE '%${filter}%'
            GROUP BY instructors.id ORDER BY total_students DESC`, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows);
        });
    },
    // Atualiza os dados do instrutor
    update(data, callback) {
        const query = `
            UPDATE instructors SET
            avatar_url=($1),
            name=($2),
            birth=($3),
            gender=($4),
            services=($5)
            WHERE id = $6
        `;

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.gender,
            data.services,
            data.id
        ];

        db.query(query, values, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback();
        });
    },
    // Deleta instrutor
    delete(id, callback) {
        db.query('DELETE FROM instructors WHERE id = $1', [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            return callback();
        });
    },
    // Paginação do index
    paginate(params) {
        const { filter, limit, offset, callback } = params;

        let query = '',
            filterQuery = '',
            totalQuery = '(SELECT COUNT(*) FROM instructors) AS total';

        if (filter) {
            filterQuery = `WHERE instructors.name ILIKE '%${filter}%'
                OR instructors.services ILIKE '%${filter}%'`;

            totalQuery = `(SELECT COUNT(*) FROM instructors
                ${filterQuery}) AS total`;
        }

        query = `SELECT instructors.*, ${totalQuery}, 
            COUNT (members) AS total_students FROM instructors
            LEFT JOIN members ON (instructors.id = members.instructor_id) 
            ${filterQuery} GROUP BY instructors.id LIMIT $1 OFFSET $2`;

        db.query(query, [limit, offset], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows);
        });
    }
};