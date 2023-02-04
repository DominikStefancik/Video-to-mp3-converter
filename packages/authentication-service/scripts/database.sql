DROP DATABASE IF EXISTS vtac_authentication_service;

CREATE DATABASE vtac_authentication_service;

CREATE TABLE vtac_user (
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR NOT NULL
);

INSERT INTO vtac_user (email, password) VALUES ('admin-user@vtac.com', '1234456');
INSERT INTO vtac_user (email, password) VALUES ('tech-user@vtac.com', '1234456');