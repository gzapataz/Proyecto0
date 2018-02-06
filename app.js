/*jshint esversion: 6 */
var express = require('express');
var bodyParser = require('body-parser');
var Evento = require('./src/js/event');
var User = require('./src/js/user');
var pgPool = require('./src/js/pgPool');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

// Invoca singleton para acceder BD
const pool = pgPool.getPool();
var app = express();
var port = process.env.PORT || 5000;
var regStatus = '';

var nav = [{ Link: '/Eventos', Text: 'Eventos' }];
var router = require('./src/routes/eventRouters')(nav);
var authRouter = require('./src/routes/authRoutes')(nav);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({
    secret: 'eventos',
    resave: true,
    saveUninitialized: true
}));
require('./src/config/passpport')(app);


app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use('/Eventos', router);
app.use('/Auth', authRouter);

var eventos = router.eventos;

app.get('/', function(req, res) {
    res.render('index', {
        title: 'Administrador de Eventos',
        nav: nav,
        regStatus: regStatus
    });
});

app.listen(port, function(err) {
    console.log('running server on port ' + port);
});