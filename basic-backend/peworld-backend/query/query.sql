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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY(worker_id) REFERENCES workers(id)
);

CREATE TABLE profile_pictures(
    id VARCHAR(128) PRIMARY KEY,
    file_url TEXT NOT NULL,
    worker_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY(worker_id) REFERENCES workers(id)
);

CREATE TABLE work_experiences(
    id VARCHAR(128) PRIMARY KEY,
    position VARCHAR(128) NOT NULL,
    company VARCHAR(64) NOT NULL,
    start_date DATE NOT NULL,
    description TEXT NOT NULL,
    worker_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY(worker_id) REFERENCES workers(id)
);
CREATE TABLE experience_company_logo(
    id VARCHAR(128) PRIMARY KEY,
    file_url TEXT NOT NULL,
    experience_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY(experience_id) REFERENCES work_experiences(id)
);

CREATE TABLE portfolios(
    id VARCHAR(128) PRIMARY KEY,
    application_name VARCHAR(128) NOT NULL,
    repo_link TEXT NOT NULL,
    portfolio_type VARCHAR(64) NOT NULL,
    worker_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY(worker_id) REFERENCES workers(id)
);
CREATE TABLE portfolio_picture(
    id VARCHAR(128) PRIMARY KEY,
    file_url TEXT NOT NULL,
    portfolio_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY(portfolio_id) REFERENCES portfolios(id)
);