const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/evento';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
    'CREATE TABLE evento(id SERIAL PRIMARY KEY, \
                        customerid number, \
                        nombre VARCHAR(40) not null, \
                        fechainicial DATE, \
                        fechafinal DATE, \
                        complete BOOLEAN)');
const query2 = client.query(
    'CREATE TABLE evento(id SERIAL PRIMARY KEY, \
                        email VARCHAR(40) not null, \
                        nombre VARCHAR(40) not null, \
                        password VARCHAR(40) not null');
query.on('end', () => {
    client.end();


});