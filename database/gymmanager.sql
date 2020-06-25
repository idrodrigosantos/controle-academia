CREATE DATABASE gymmanager;

CREATE TABLE instructors (
    id SERIAL PRIMARY KEY,
    avatar_url text,
    name text,
    birth timestamp without time zone,
    gender text,
    services text,
    created_at timestamp without time zone
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name text,
    avatar_url text,
    email text,
    gender text,
    birth timestamp without time zone,
    blood text,
    weight integer,
    height integer,
    instructor_id integer
);

INSERT INTO instructors (avatar_url, name, birth, gender, services, created_at) VALUES
('https://source.unsplash.com/5UbIqV58CW8', 'Maria Silva', '1992-05-20 00:00:00', 'F', 'Crossfit', '2020-02-25 00:00:00'),
('https://source.unsplash.com/TAZoUmDqzXk', 'João Silva', '1989-04-14 00:00:00', 'M', 'Musculação, Futebol', '2020-02-15 00:00:00'),
('https://source.unsplash.com/0ShTs8iPY28', 'Juliana Campos', '2000-05-10 00:00:00', 'F', 'Natação, Crossfit, Musculação', '2020-06-18 00:00:00'),
('https://source.unsplash.com/sHfo3WOgGTU', 'Martin Pedro Ferreira', '2000-05-10 00:00:00', 'M', 'Crossft', '2020-06-18 00:00:00'),
('https://source.unsplash.com/KblIFRq1jkg', 'Natália Moraes', '2000-10-10 00:00:00', 'F', 'Futebol', '2020-06-19 00:00:00');

INSERT INTO members (name, avatar_url, email, gender, birth, blood, weight, height, instructor_id) VALUES
('Roberta Santos', 'https://source.unsplash.com/5UbIqV58CW8', 'robertasantos@email.com', 'F', '1992-09-10 00:00:00', 'B+', 70, 175, 4),
('José Amarantes', 'https://source.unsplash.com/TAZoUmDqzXk', 'joaseamarantes@email.com', 'M', '1995-06-20 00:00:00', 'O+', 98, 184, 2),
('Leonardo das Neves', 'https://source.unsplash.com/sHfo3WOgGTU', 'leonardodasneves@email.com', 'M', '1991-10-20 00:00:00', 'B-', 80, 190, 5),
('Melissa Souza', 'https://source.unsplash.com/T-hBGkb3-xQ', 'melissasouza@email.com', 'F', '1988-07-10 00:00:00', 'AB-', 50, 160, 1);