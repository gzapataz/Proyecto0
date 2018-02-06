var pgPool = require('../js/pgPool');
var Evento = require('../js/event');

const pool = pgPool.getPool();


var eventController = function(eventService, nav) {
    var middleware = function(req, res, next) {
        next();
    }

    var getIndex = function(req, res) {
        if (req.user === undefined) {
            res.redirect('/');
            return;
        }
        var userid = req.user.id;
        if (userid) {
            pool.query('select id, descripcion,  to_char(fechainicio, \'YYYY-MM-DDThh:mi\') as fechainicio, \
            to_char(fechafin, \'YYYY-MM-DDThh:mi\') as fechafin, estado from event where userid=$1 order by id desc', [userid],
                function(err, recordset) {
                    res.render('evenlist', {
                        title: 'Eventos',
                        nav: nav,
                        eventos: recordset.rows
                    });
                });
        }
    };
    var getById = function(req, res) {
        var id = parseInt(req.params.id);
        pool.query('select id, descripcion,  to_char(fechainicio, \'YYYY-MM-DDThh:mi\') as fechainicio, \
                    to_char(fechafin, \'YYYY-MM-DDThh:mi\') as fechafin, estado from event where id=$1', [id],
            function(err, recordset) {
                if (recordset.rows.length === 0) {
                    res.status(404).send('Evento No Encontrado');
                } else {
                    req.event = recordset.rows[0];
                    res.render('evento', {
                        title: 'Evento',
                        nav: nav,
                        evento: req.event
                    });
                }
            });
    };
    var insertEvent = function(req, res) {
        var newEvento = new Evento(null, req.user.id, req.body.descripcion, req.body.fechainicio, req.body.fechafin, 'Pendiente');
        pool.query('INSERT INTO "event" ' +
            '(descripcion, userid, fechainicio, fechafin, estado) VALUES($1, $2, $3, $4, $5)', [newEvento.descripcion, newEvento.userid, newEvento.fechaInicio, newEvento.fechaFin, newEvento.estado],
            function(err, result) {
                console.log('Error ' + err);
                res.redirect('/Eventos');
            })
    };

    return {
        getIndex: getIndex,
        getById: getById,
        middleware: middleware,
        insertEvent: insertEvent
    }

}
module.exports = eventController;