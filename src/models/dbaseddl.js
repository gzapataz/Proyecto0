/*jshint esversion: 6 */
var pgPool = require('../js/pgPool');
const pool = pgPool.getPool();

pool.query(
    'DROP TABLE IF EXISTS "user";' +
    'CREATE TABLE "user"(id SERIAL PRIMARY KEY, email VARCHAR(40), name VARCHAR(40), password VARCHAR(20));' +
    'DROP TABLE IF EXISTS "event";' +
    'CREATE TABLE "event"(id SERIAL PRIMARY KEY, userid SERIAL, descripcion VARCHAR(40), fechaInicio timestamp, fechaFin timestamp, estado VARCHAR(30));',
    function(err, res) {
        if (err) {
            console.log('ERROR Creacion Tablas: ' + err);
        } else {
            console.log('Tablas creadas ...');
        }
    });