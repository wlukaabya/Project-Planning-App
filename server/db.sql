CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    project_title VARCHAR(255) NOT NULL,
    date DATE NOT NULL
    
);

CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    projects_id INTEGER NOT NULL REFERENCES projects(id),
    date DATE NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL
);

