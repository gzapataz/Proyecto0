/*jshint esversion: 6 */

var express = require('express');

var eventRouter = express.Router();
var Evento = require('../js/event');
var User = require('../js/user');
var pgPool = require('../js/pgPool');

const pool = pgPool.getPool();
var loggedUser = 0;

//cRud Query eventos asociados al usuario
var router = function(nav) {
    var eventos;
    try {
        eventRouter.use(function(req, res, next) {
            if (!req.user) {
                res.redirect('/');
            } else {
                loggedUser = req.user.id;
            }
            next();
        })
        eventRouter.route('/')
            .get(function(req, res) {
                var userid = parseInt(loggedUser);
                console.log('user:' + userid);
                if (userid) {
                    pool.query('select id, descripcion,  to_char(fechainicio, \'YYYY-MM-DDThh:mi\') as fechainicio, \
                    to_char(fechafin, \'YYYY-MM-DDThh:mi\') as fechafin, estado from event where userid=$1', [userid],
                        function(err, recordset) {
                            res.render('evenlist', {
                                title: 'Eventos',
                                nav: nav,
                                eventos: recordset.rows
                            });
                        });
                }
            });
    } catch (e) {
        console.log('Logged');
    }
    eventRouter.route('/evento')
        .post(function(req, res) {
            newEvento = new Evento(null, loggedUser, req.body.descripcion, req.body.fechainicio, req.body.fechafin, 'Pendiente');
            pool.query('INSERT INTO "event" ' +
                //'(userid, descripcion, fechainicio, fechafin, estado) VALUES($1, $2, $3, $4)', [1, 'Pruebs', '12/12/12', '12/12/12', 'Pendiente'],
                '(descripcion, userid, fechainicio, fechafin, estado) VALUES($1, $2, $3, $4, $5)', [newEvento.descripcion, newEvento.userid, newEvento.fechaInicio, newEvento.fechaFin, newEvento.estado],
                function(err, result) {
                    console.log('Error ' + err);
                    res.redirect('/Eventos');
                })
            console.log('CREANDO EVENTO ' + JSON.stringify(req.body));
        })
        //Query de un evento particular

    eventRouter.route('/evento/:id')
        .all(function(req, res, next) {
            console.log('Aqui 1 ' + req.method);
            var id = parseInt(req.params.id);
            pool.query('select id, descripcion,  to_char(fechainicio, \'YYYY-MM-DDThh:mi\') as fechainicio, \
                        to_char(fechafin, \'YYYY-MM-DDThh:mi\') as fechafin, estado from event where id=$1', [id],
                function(err, recordset) {
                    if (recordset.rows.length === 0) {
                        res.status(404).send('Evento No Encontrado');
                    } else {
                        req.event = recordset.rows[0];
                        next();
                    }
                });

        })
        .get(function(req, res) {
            res.render('evento', {
                title: 'Evento',
                nav: nav,
                evento: req.event
            });
        })
        .post(function(req, res) {
            console.log('Subevento ...' + req.body._method + ' ' + req.params.id);
            if (req.body._method === 'delete') {
                pool.query('DELETE FROM "event" WHERE id = $1', [parseInt(req.params.id)],
                    function(err, result) {
                        res.redirect('/Eventos');
                    })
            } else {
                console.log('Entro al else' + req.body._method + '/');
                if (req.body._method == 'put') {
                    console.log('Actualizando' + req.params.id);
                    console.log('Actualizando' + JSON.stringify(req.body));

                    pool.query('UPDATE "event" SET descripcion = $1, fechainicio = $2, fechafin = $3, estado = $4 WHERE id = $5', [req.body.descripcion, req.body.fechainicio, req.body.fechafin, req.body.estado, parseInt(req.params.id)],
                        function(err, result) {
                            console.log('ERROR: ' + err);
                            res.redirect('/Eventos');
                        })
                }
            }
        })
    return eventRouter;
};

module.exports = router;