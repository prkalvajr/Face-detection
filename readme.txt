-- npm packages
* Back-end
https://knexjs.org/guide/#configuration-options
npm install knex
npm install pg

-- PostgreSQL

createdb 'smart-brain'
psql smart-brain

CREATE TABLE users (
	id serial PRIMARY KEY,
	name VARCHAR(100),
	email text UNIQUE NOT NULL,
	entries BIGINT DEFAULT 0,
	joined TIMESTAMP NOT NULL		
);


CREATE TABLE login (
	id serial PRIMARY KEY,
	hash varchar(100) NOT NULL,
	email text UNIQUE NOT NULL
);