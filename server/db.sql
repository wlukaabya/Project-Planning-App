CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    project_title VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    task VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    assignee VARCHAR(50) NOT NULL
);


SELECT DISTINCT projects.* FROM projects JOIN tasks ON tasks.project_id = projects.id WHERE tasks.assignee = 'assignee_name';