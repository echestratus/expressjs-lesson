CREATE DATABASE exercise;

CREATE TABLE categories(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(64),
    description TEXT DEFAULT 'No description provided'
);

CREATE TABLE distributors(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(64),
    address TEXT
);

CREATE TABLE products(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(64),
    description TEXT DEFAULT 'No description provided',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    category_id INT,
    distributor_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id),
    FOREIGN kEY(distributor_id) REFERENCES distributors(id)


);

CREATE TABLE manytomany_category_and_distributor(
    category_id INT,
    distributor_id INT,
    PRIMARY KEY(category_id, distributor_id)
);

INSERT INTO  categories(name, description) VALUES('Shirt', 'Shirt for upperbody'), ('Pants', 'Pants for lower body'), ('Shoes', 'Shoes for foot'), ('Headwear', 'Headwear for head');

INSERT INTO distributors(name, address) VALUES('PT Aesir', 'Jl. Asgard'), ('PT Vanir', 'Jl. Vanaheim'), ('PT Elves', 'Jl. Alfheim'), ('PT Jotnar', 'Jl. Jotunheim');

INSERT INTO products(name, description, price, stock, category_id, distributor_id) VALUES('White T-Shirt', 'Good White Shirt', 10000, 10, 1, 1), ('Green T-Shirt', 'Good for hunting', 120000, 12, 1, 1), ('Gold T-Shirt', 'Good for rich person', 9999999, 99, 1, 2), ('White Pants', 'Good White pants', 190000, 19, 2, 2), ('Black Pants', 'Good for Men in Black', 789000, 89, 2, 1), ('Grey Shoes', 'Good informal shoes', 909000, 90, 3, 3), ('White cap', 'Good cap', 899000, 98, 4, 4);

INSERT INTO manytomany_category_and_distributor(category_id, distributor_id) VALUES(1, 1), (1, 1), (1, 2), (2, 2), (2, 1), (3, 3), (4, 4);

SELECT products.name, products.description, products.price, products.stock, products.category_id, categories.name AS category, products.distributor_id, distributors.name AS distributor  FROM products INNER JOIN categories ON products.category_id = categories.id INNER JOIN distributors ON products.distributor_id = distributors.id;

SELECT * FROM manytomany_category_and_distributor;

SELECT distributors.name, manytomany_category_and_distributor.*, categories.name FROM distributors INNER JOIN manytomany_category_and_distributor ON distributors.id = manytomany_category_and_distributor.distributor_id INNER JOIN categories ON categories.id = manytomany_category_and_distributor.category_id;