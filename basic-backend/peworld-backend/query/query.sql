CREATE TABLE users(
    id VARCHAR(128) PRIMARY KEY,
    email VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE workers(
    id VARCHAR(128) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    job_desk VARCHAR(64),
    domicile VARCHAR(64),
    workplace VARCHAR(64),
    description TEXT,
    user_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE skills(
    id VARCHAR(128) PRIMARY KEY,
    name VARCHAR(64),
    worker_id VARCHAR(128),
    FOREIGN KEY(worker_id) REFERENCES workers(id)
);

CREATE TABLE profile_pictures(
    id VARCHAR(128) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    worker_id VARCHAR(128) NOT NULL,
    FOREIGN KEY(worker_id) REFERENCES workers(id)
);