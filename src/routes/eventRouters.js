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
    var eventController = require('../controllers/eventController')(null, nav);

    eventRouter.use(eventController.middleware);
    eventRouter.route('/')
        .get(eventController.getIndex);
    eventRouter.route('/evento')
        .post(eventController.insertEvent);
    //Query de un evento particular

    eventRouter.route('/evento/:id')
        .get(eventController.getById)
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